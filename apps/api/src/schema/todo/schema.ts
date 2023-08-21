import { db } from "@acme/db"
import { queryFromInfo } from "@pothos/plugin-prisma"
import { builder, IntFilter, StringFilter } from "src/builder.js"

const TodoFilter = builder.prismaWhere("Todo", {
  fields: (t) => ({
    id: IntFilter,
    title: StringFilter,
    description: StringFilter,
    AND: true,
    OR: true,
  }),
})

export const TodoOrderBy = builder.prismaOrderBy("Todo", {
  fields: {
    id: true,
    title: true,
    description: true,
  },
})

export const PrismaTodo = builder.prismaObject("Todo", {
  fields: (t) => ({
    id: t.exposeInt("id"),
    title: t.exposeString("title", { nullable: true }),
    description: t.exposeString("description", { nullable: true }),
    user: t.relation("user"),
  }),
})

export const PrismaTodoUser = builder.prismaObject("User", {
  fields: (t) => ({
    email: t.exposeString("email"),
  }),
})

builder.queryFields((t) => ({
  todo: t.prismaField({
    authScopes: {
      isAuthorized: false,
    },
    type: PrismaTodo,
    args: {
      id: t.arg({ type: "Int", required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return db.todo.findUniqueOrThrow({
        ...queryFromInfo({ context, info }),
        where: { id: args.id },
      })
    },
  }),

  todos: t.prismaConnection({
    type: PrismaTodo,
    cursor: "id",
    args: {
      filter: t.arg({ type: TodoFilter }),
      order: t.arg({ type: TodoOrderBy }),
    },
    authScopes: {
      isAuthorized: false,
    },

    totalCount: (parent, args, context, info) => db.todo.count({ where: args.filter ?? undefined }),
    resolve: async (query, parent, args, context, info) => {
      return await db.todo.findMany({
        ...query,
        where: args.filter ?? undefined,
        orderBy: args.order ?? undefined,
      })
    },
  }),
}))

builder.mutationFields((t) => ({
  createTodo: t.prismaField({
    authScopes: {
      isAuthorized: true,
    },
    type: PrismaTodo,
    args: {
      title: t.arg({ type: "String", required: true }),
    },
    resolve: async (query, parent, args, context, info) => {
      return db.todo.create({ ...query, data: { ...args, userId: context.session.userId } })
    },
  }),
  updateTodo: t.prismaField({
    authScopes: (parent, args, context, info) => {
      return {
        isAuthorized: true,
        hasPermission: { action: "update", resource: "Todo", query: { id: args.id } },
      }
    },
    type: PrismaTodo,
    args: {
      id: t.arg({ type: "Int", required: true }),
      title: t.arg({ type: "String", required: false }),
      description: t.arg({ type: "String", required: false }),
    },
    resolve: async (query, parent, args, context, info) => {
      return db.todo.update({
        ...query,
        data: { title: args.title, description: args.description },
        where: { id: args.id },
      })
    },
  }),
}))
