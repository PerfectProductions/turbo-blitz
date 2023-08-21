/* eslint-disable */
import type { Prisma, User, Session, Token, Todo } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: Prisma.UserCreateInput;
        Update: Prisma.UserUpdateInput;
        RelationName: "todos" | "tokens" | "sessions";
        ListRelations: "todos" | "tokens" | "sessions";
        Relations: {
            todos: {
                Shape: Todo[];
                Name: "Todo";
            };
            tokens: {
                Shape: Token[];
                Name: "Token";
            };
            sessions: {
                Shape: Session[];
                Name: "Session";
            };
        };
    };
    Session: {
        Name: "Session";
        Shape: Session;
        Include: Prisma.SessionInclude;
        Select: Prisma.SessionSelect;
        OrderBy: Prisma.SessionOrderByWithRelationInput;
        WhereUnique: Prisma.SessionWhereUniqueInput;
        Where: Prisma.SessionWhereInput;
        Create: Prisma.SessionCreateInput;
        Update: Prisma.SessionUpdateInput;
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User | null;
                Name: "User";
            };
        };
    };
    Token: {
        Name: "Token";
        Shape: Token;
        Include: Prisma.TokenInclude;
        Select: Prisma.TokenSelect;
        OrderBy: Prisma.TokenOrderByWithRelationInput;
        WhereUnique: Prisma.TokenWhereUniqueInput;
        Where: Prisma.TokenWhereInput;
        Create: Prisma.TokenCreateInput;
        Update: Prisma.TokenUpdateInput;
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
            };
        };
    };
    Todo: {
        Name: "Todo";
        Shape: Todo;
        Include: Prisma.TodoInclude;
        Select: Prisma.TodoSelect;
        OrderBy: Prisma.TodoOrderByWithRelationInput;
        WhereUnique: Prisma.TodoWhereUniqueInput;
        Where: Prisma.TodoWhereInput;
        Create: Prisma.TodoCreateInput;
        Update: Prisma.TodoUpdateInput;
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
            };
        };
    };
}