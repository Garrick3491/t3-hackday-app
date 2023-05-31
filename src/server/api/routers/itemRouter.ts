import { use } from "react";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import User from '@prisma/client'

export const itemRouter = createTRPCRouter({
    addShoppingList: protectedProcedure.input(
            z.object({
                name: z.string(),
                userId: z.string()
            })
    ).mutation(async ({input, ctx}) => {
        const { name, userId } = input

        const item = await ctx.prisma.cartItem.create({
            data: {
                name,
                checked: false,
                userId
            }
        })

        return item
    }),

    getShoppingList: protectedProcedure.input(z.object({
        userId: z.string()
    })).query(({input, ctx}) => {
        const {userId} = input;
        const items = ctx.prisma.cartItem.findMany({
            where: {
                userId: userId
            }
        });
        console.log(items);
        
        return items;
    }),

    deleteShoppingItem: protectedProcedure.input(
        z.object({
            id: z.string(),
        })
).mutation(async ({input, ctx}) => {
        console.log(input);
        const {id} = input;

        const item = ctx.prisma.cartItem.delete({
            where: {
                id,
            },
        })

        return item

    }),

    toggleChecked: protectedProcedure.input(
        z.object({
            id: z.string(),
            checked: z.boolean(),
        })
    ).mutation(async ({input, ctx}) => {
    const { id, checked } = input

    const item = await ctx.prisma.cartItem.update({
        where: {
            id,
          },
          data: {
            checked,
          },
    })

    return item
    }),
})