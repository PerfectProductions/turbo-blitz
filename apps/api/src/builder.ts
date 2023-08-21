import { DateResolver, DateTimeResolver } from "graphql-scalars"
import SchemaBuilder from "@pothos/core"
import PrismaPlugin from "@pothos/plugin-prisma"
import type PrismaTypes from "@acme/db/prisma/pothos-types"
import RelayPlugin from "@pothos/plugin-relay"
import PrismaUtils from "@pothos/plugin-prisma-utils"

import ScopeAuthPlugin from "@pothos/plugin-scope-auth"
import { db, Prisma } from "@acme/db"
import { createGraphQLError } from "graphql-yoga"
import { AbilityType, GuardHandler } from "@acme/guard"

export type SessionContext = {
  userId: number
  role: string
  $isAuthorized: () => boolean
}
export type Ctx = {
  session: SessionContext
}

export const builder = new SchemaBuilder<{
  Context: Ctx
  Scalars: {
    ID: {
      Output: number | string
      Input: string
    }
    Date: {
      Output: Date
      Input: Date
    }
    DateTime: {
      Output: Date
      Input: Date
    }
  }
  AuthScopes: {
    isAuthorized: boolean
    hasPermission: {
      action: AbilityType<"">
      resource: Prisma.ModelName
      query?: any
    }
  }

  PrismaTypes: PrismaTypes
}>({
  plugins: [RelayPlugin, PrismaPlugin, PrismaUtils, ScopeAuthPlugin],
  prisma: {
    client: db,
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false
    exposeDescriptions: false,
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
    dmmf: Prisma.dmmf,
  },
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: "omit",
    cursorType: "String",
  },
  scopeAuthOptions: {
    runScopesOnType: true,
  },
  authScopes: async (context) => ({
    isAuthorized: async () => {
      if (!context.session || !context.session.$isAuthorized()) {
        throw createGraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
            http: {
              status: 401,
            },
          },
        })
      }

      return true
    },

    hasPermission: async ({ action, resource, query }) => {
      const { can } = await GuardHandler.can(action, resource, context, query)

      if (!can) {
        throw createGraphQLError("Forbidden", {
          extensions: {
            code: "FORBIDDEN",
            http: {
              status: 403,
            },
          },
        })
      }

      return can
    },
  }),
})

builder.queryType()
builder.mutationType()

// Source:
// https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts
export const IntFilter = builder.prismaFilter("Int", {
  name: "IntFilter",
  ops: ["equals", "in", "notIn", "not", "is", "isNot", "lt", "lte", "gt", "gte"],
})

// Source:
// https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts
export const DateTimeFilter = builder.prismaFilter("DateTime", {
  name: "DateTimeFilter",
  ops: ["equals", "in", "notIn", "not", "is", "isNot", "lt", "lte", "gt", "gte"],
})

// Source:
// https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts
export const StringFilter = builder.prismaFilter("String", {
  name: "StringFilter",
  ops: [
    "equals",
    "in",
    "notIn",
    "not",
    "is",
    "isNot",
    "equals",
    "in",
    "notIn",
    "not",
    "is",
    "isNot",
    "contains",
    "startsWith",
    "endsWith",
    "lt",
    "lte",
    "gt",
    "gte",
  ],
})

// Source:
// https://github.com/hayes/pothos/blob/main/packages/plugin-prisma-utils/tests/examples/codegen/schema/prisma-inputs.ts
export const BooleanFilter = builder.prismaFilter("Boolean", {
  name: "BooleanFilter",
  ops: ["equals", "in", "notIn", "not", "is", "isNot"],
})

builder.addScalarType("Date", DateResolver, {})
builder.addScalarType("DateTime", DateTimeResolver, {})
