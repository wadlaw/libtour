
import { TRPCError } from "@trpc/server";

// import { error } from "console";

import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure, entryProcedure, adminProcedure } from "~/server/api/trpc";

export const compRouter = createTRPCRouter({
    update: adminProcedure
      .input(z.object({ igCompId: z.string().min(4), shortName: z.string().min(1), name: z.string().min(1), date: z.date(), stableford: z.boolean(), lib: z.boolean(), eclectic: z.boolean() }))
      .mutation(async ({ ctx, input}) => {
        const comp = await ctx.db.comp.findFirst({
          where: {
            igCompId: input.igCompId
          }
        })
        if (!comp || comp.completed) {
          throw new TRPCError({ code: "PRECONDITION_FAILED" })
        } else {
          return ctx.db.comp.update({
            where: {
              igCompId: input.igCompId,
            },
            data: {
              shortName: input.shortName,
              name: input.name,
              date: input.date,
              stableford: input.stableford,
              lib: input.lib,
              eclectic: input.eclectic
            }
          })
        }
      }), 
    
      delete : adminProcedure
        .input(z.object({ igCompId: z.string().min(4)}))
        .mutation(({ ctx, input }) => {
          return ctx.db.comp.delete({
            where: {
              igCompId: input.igCompId
            }
          })
        }),

    // withdraw: protectedProcedure
    enter: protectedProcedure
      .input(z.object({ comp: z.string().min(3) }))
      .mutation(async ({ ctx, input }) => {
        const comp = await ctx.db.comp.findFirst({
          where: {
            igCompId: input.comp,
            lib: true,
          }
        })
        if (comp?.open) {
          return await ctx.db.compEntrant.create({
            data: {
              compId: input.comp,
              entrantId: ctx.entrant.id,
              transactions: {
                create: [
                  {
                    amount: 500,
                    description: 'Entry Fee',
                    type: 'DR',
                    netAmount: -500,
                    createdAt: comp.date
                  }
                ]
              }
            }
          })
        } else {throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Comp is not open for entry!" })}
      }),

      enterSomeoneElse: entryProcedure
      .input(z.object({ comp: z.string().min(3), entrantId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        
        const comp = await ctx.db.comp.findFirst({
          where: {
            igCompId: input.comp,
            lib: true,
          }
        })
        if (comp?.open) {
          console.log(`Entering ${comp?.name} for entrant ${input.entrantId}`)
          return await ctx.db.compEntrant.create({
            data: {
              compId: input.comp,
              entrantId: input.entrantId,
              transactions: {
                create: [
                  {
                    amount: 500,
                    description: 'Entry Fee',
                    type: 'DR',
                    netAmount: -500,
                    createdAt: comp.date
                  }
                ]
              }
            }
          })
        } else {throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Comp is not open for entry!" })}
      }),

      withdraw: protectedProcedure
      .input(z.object({ comp: z.string().min(3) }))
      .mutation(async ({ ctx, input }) => {
        
        const comp = await ctx.db.comp.findFirst({
          where: {
            igCompId: input.comp,
            lib: true,
          }
        })
        if (comp?.open) {
        
          return await ctx.db.compEntrant.delete({
              where: {
                compId_entrantId: { compId: input.comp, entrantId: ctx.entrant.id}
              }
            })
          } else {throw new TRPCError({ code: "PRECONDITION_FAILED", message: "All entries have been locked in!" })}
        
      }),

      withdrawSomeoneElse: entryProcedure
      .input(z.object({ comp: z.string().min(3), entrantId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        
        const comp = await ctx.db.comp.findFirst({
          where: {
            igCompId: input.comp,
            lib: true,
          }
        })
        if (comp?.open) {
        return await ctx.db.compEntrant.delete({
            where: {
              compId_entrantId: { 
                compId: input.comp, 
                entrantId: input.entrantId 
              }
            }
          })
        } else {throw new TRPCError({ code: "PRECONDITION_FAILED", message: "All entries have been locked in!" })}
      }),

    // withdraw: protectedProcedure
    //   .input(z.object({ comp: z.string().min(3) }))
    //   .mutation(async ({ ctx, input }) => {
        
    //     return ctx.db.compEntrant.delete({
    //       where: {
    //         compId: input.comp,
    //         entrantId: (await ctx.user).id
    //       }
    //     })
    //   }),

    get: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.comp.findFirst({
        where: {
          OR: [
            { igCompId: input.comp },
            { shortName: input.comp.toLowerCase() }
          ]

        }
    })
  }),

  getOne: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.comp.findFirst({
        where: {
          OR: [
            { igCompId: input.comp },
            { shortName: input.comp.toLowerCase() }
          ]

        },
        include: {
          entrants: {
            orderBy: {
              position: 'asc'
            },
            take: 3,
            include: {
              entrant: true
            }
          },
          teamPoints: {
            orderBy: {
              points: 'desc'
            },
            take: 1,
            include: {
              team: true
            }
          }
        }
    })
  }),

  getOneWithScores: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.comp.findFirst({
        where: {
          OR: [
            { igCompId: input.comp },
            { shortName: input.comp.toLowerCase() }
          ]

        },
        include: {
          entrants: {
            orderBy: {
              position: 'asc'
            },
            include: {
              entrant: true,
              scorecard: {
                include: {
                  holes: {
                    orderBy: {
                      holeNo: 'asc'
                    }
                  }
                }
              }
            }
          },
        }
    })
  }),

  getOneWithPrizes: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.comp.findFirst({
        where: {
          OR: [
            { igCompId: input.comp },
            { shortName: input.comp.toLowerCase() }
          ]

        },
        include: {
         transactions: {
          where: {
            winnings: true
          },
          orderBy: [
            { amount: 'desc' },
          ],
          include: {
            entrant: true
           }
         },
         
        }
    })
  }),

  isEntered: protectedProcedure
    .input(z.object({ comp: z.string().min(4) }))
    .query(async ({ ctx, input }) => {

      return ctx.db.compEntrant.findFirst({
        where: {
          compId: input.comp,
          entrantId: ctx.entrant.id
        },
        include: {
          comp: true
        }
      })
    }),

    isSomeoneEntered: protectedProcedure
    .input(z.object({ comp: z.string().min(4), entrantId: z.number() }))
    .query(async ({ ctx, input }) => {

      return ctx.db.compEntrant.findFirst({
        where: {
          compId: input.comp,
          entrantId: input.entrantId,
        },
        include: {
          comp: true
        }
      })
    }),


  getResults: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.compEntrant.findMany({
        where: {
          compId: input.comp
        },
        orderBy: {
          position: "asc"
        },
        include: {
          entrant: true,
          transactions: {
            where: {
              winnings: true,
            },
          },
          scorecard: {
            include: {
              holes: {
                orderBy: [{holeNo: 'asc'}]
              }
            }
          },
        }
    })
  }),

  getWinners: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.compEntrant.findMany({
        where: {
          compId: input.comp,
        transactions: {
          some: {
            winnings: true
          }
        }
      },
        orderBy: {
          position: "asc"
        },
        include: {
          transactions: {
            where: {
              winnings: true,
            },
          },
          entrant: true,
        }
    })
  }),

  getEntrants: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(({ ctx, input }) => {
      
    return ctx.db.compEntrant.findMany({
        where: {
          compId: input.comp
        },
        include: {
          
          entrant: true,
        },
        orderBy: [{
          entrant: {
            team: {
              teamName: 'asc'
            }
          }
        },
        {
          entrant: {
            name: 'asc'
          },

        }]
    })
  }),

  getNonEntrants: publicProcedure
    .input(z.object({ comp: z.string().min(3) }))
    .query(async ({ ctx, input }) => {

      //Get list of entrant that ARE in the comp so we can exclude them from the returned data 
      const enteredIds = await ctx.db.compEntrant.findMany({
        select: {
          entrantId: true
        },
        where: {
          OR: [
            { compId: input.comp },
            { comp: { shortName: input.comp }}
          ]
          
        }
      })

      //Return a list of entrants that are NOT entered into the competition
      return ctx.db.entrant.findMany({
        where: {
          id: { notIn: enteredIds.map(entId => entId.entrantId) }
        },
        orderBy: [
          { team: { teamName: 'asc' }},
          { name: 'asc' }
        ]
      })
  }),

  getList: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "asc" }
    })
  }),


  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "asc" },
        include: {
            entrants: {
              include: {
                entrant: true
              }
            }
        }
    })
  }),
  
  getAllLib: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "asc" },
        where: {
          lib: true
        },
        include: {
            entrants: {
              include: {
                entrant: true
              }
            }
        }
    })
  }),

  getAllEclectic: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "asc" },
        where: {
          eclectic: true
        },
        include: {
            entrants: {
              include: {
                entrant: true
              }
            }
        }
    })
  }),

  getUpcoming: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "asc" },
        where: {
          completed: false,
          lib: true,
        },
        take: 5,
        include: {
            entrants: {
              include: {
                entrant: true
              }
            }
        }
    })
  }),

  getAllUpcoming: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "asc" },
        where: {
          completed: false,
          lib: true
        },
    })
  }),


  getRecent: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "desc" },
        where: {
          completed: true,
          lib: true,
        },
        take: 5,
        include: {
            entrants: {
              include: {
                entrant: true
              }
            }
        }
    })
  }),

  getAllCompleted: publicProcedure.query(({ ctx }) => {
    return ctx.db.comp.findMany({
        orderBy: { date: "desc" },
        where: {
          completed: true,
          lib: true
        },
    })
  }),

  

  setOpen: entryProcedure
    .input(z.string().min(4))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comp.update({
        where: {
          igCompId: input
        },
        data: {
          open: true,
          completed: false
        }
      })
  }),

  setClosed: entryProcedure
    .input(z.string().min(4))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comp.update({
        where: {
          igCompId: input
        },
        data: {
          open: false,
          completed: false
        }
      })
  }),

  setCurrent: entryProcedure
    .input(z.string().min(4))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comp.update({
        where: {
          igCompId: input
        },
        data: {
          current: true,
        }
      })
  }),
  // getTeamResultsForComp: publicProcedure
  //   .input(z.object({ compId: z.string() }))
  //   .query(({ ctx, input}) => {
  //     return ctx.db.teamPoints.findMany({
  //       where: {
  //         OR: [
  //           {comp: { shortName: input.compId }},
  //           {comp: { igCompId: input.compId }}
  //           ]
  //         },
  //       orderBy: [
  //           { points: "desc" }
  //       ],
  //       include: {
  //         team: true,
  //       }
  //     })
      
  //   }),

    getTeamResultsForComp: publicProcedure
    .input(z.object({ compId: z.string() }))
    .query(async ({ ctx, input}) => {
      //Check whether comp is stableford
      const stab = await ctx.db.comp.findFirst({
        where: {
          OR: [
            { shortName: input.compId },
            { igCompId: input.compId }
            ]
          },
          select: {
            stableford: true
          }
      })

      return ctx.db.teamPoints.findMany({
        where: {
          OR: [
            {comp: { shortName: input.compId }},
            {comp: { igCompId: input.compId }}
            ]
          },
        orderBy: [
            { points: "desc" }
        ],
        include: {
          team: true,
          comp: {
            
            include: {
              entrants: {
                orderBy: [
                  { teamScore: `${stab?.stableford ?? false ? 'desc' : 'asc'}`},
                  { igPosition: 'asc' }
                ],
                include: {
                  entrant: true
                }
              }
            }
          }
        }
      })
      
    }),

    entrantCount: publicProcedure
      .input(z.object({ comp: z.string() }))
      .query(({ ctx, input } ) => {
        return ctx.db.comp.findFirst({
          where: {
            igCompId: input.comp
          },
          include: {
            _count: {
              select: { entrants: true }
            }
          }
        })
      }),

    

    getTeamResultsForTeam: publicProcedure
    .input(z.object({ team: z.string() }))
    .query(({ ctx, input}) => {
      return ctx.db.teamPoints.findMany({
        where: {
          OR: [
            {team: { linkName: input.team }},
            {team: { id: input.team }}
            ]
          },
        orderBy: [
            {comp: { date: "asc" }}
        ],
        include: {
          comp: true
        }
      })
      
    }),

  processResults: adminProcedure
    .input(z.object({ 
      compEntrants: z.array(
        z.object({ 
          compId: z.string(),
          entrantId: z.number(),
          position: z.union([z.number(),z.null()]),
          igPosition: z.union([z.number(),z.null()]),
          score: z.union([z.number(), z.null()]),
          teamScore: z.union([z.number(), z.null()]),
          noResult: z.boolean(),
          wildcard: z.boolean()
        })
      ), 
      teamPoints: z.array(
        z.object({ 
          teamId: z.string(),
          igCompId: z.string(),
          points: z.number()
        })
      ), 
      transactions: z.array(
        z.object({ 
          entrantId: z.number(),
          amount: z.number(),
          description: z.string(),
          type: z.string(),
          netAmount: z.number(),
          igCompId: z.union([z.string(),z.null()]),
          winnings: z.boolean(),
          createdAt: z.union([z.date(), z.undefined()])
        })
      ),
      compId: z.string()}))
    .mutation(async ({ ctx, input }) => {
      const comp = await ctx.db.comp.findFirst({
        where: {
          igCompId: input.compId
        }
      })
      if (comp?.completed) {throw new TRPCError({ code: "PRECONDITION_FAILED" })}
      // add comp date to eb the transaction date on winnings
      for (const trans of input.transactions) {
        trans.createdAt = comp?.date
      }

      for (const entry of input.compEntrants) {
        await ctx.db.compEntrant.update({
          where: {
            compId_entrantId: {
              compId: entry.compId,
              entrantId: entry.entrantId
            }
          },
          data: {
            position: entry.position,
            igPosition: entry.igPosition,
            score: entry.score,
            teamScore: entry.teamScore,
            noResult: entry.noResult,
            wildcard: entry.wildcard,
           
          }
        })
      }

      const addPoints = ctx.db.teamPoints.createMany({data: input.teamPoints})

      const addPrizes= ctx.db.transaction.createMany({data: input.transactions})

      const completeComp = ctx.db.comp.update({
        where: {
          igCompId: input.compId
        },
        data: {
          completed: true,
          open: false
        }
      })
      
     await ctx.db.$transaction([ addPoints, addPrizes, completeComp])
      }
    ),

    getAllWithPointsAndTeams: publicProcedure
      .query(({ ctx }) => {
      return ctx.db.comp.findMany({
        where: {
          completed: true,
          lib: true,
        },
        include: {
          teamPoints: {
            include: {
              team: true
            },
            orderBy: {
              team: {teamName: "asc"}
            }
          }
        },
        orderBy: [
          {date: "asc"},
        ]
      })
    })



  
});