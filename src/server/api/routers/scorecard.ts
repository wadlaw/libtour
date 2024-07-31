import { z } from "zod";

import { createTRPCRouter, adminProcedure } from "~/server/api/trpc";

const CalculatePoints = (strokes: number | undefined, par: number, si: number, hcp: number, nr: boolean) => {
    if (nr || typeof(strokes) === 'undefined') {return 0}
    
    let shotsReceived = 0
    
    if (hcp < 0) {
        shotsReceived = 19 + hcp > si ? 0 : -1
    } else if (hcp > 0) {
        const shotsEveryHole = Math.trunc(hcp / 18)
        const shotsThisHole = hcp % 18 >= si ? 1 : 0
        shotsReceived = shotsEveryHole + shotsThisHole
    }
    
    const netStrokes = strokes - shotsReceived

    return Math.max(2 + (par - netStrokes),0)  
}

const CalculateNet = (strokes: number | undefined, par: number, si: number, hcp: number, nr: boolean) => {
    if (nr || typeof(strokes) === 'undefined') {return null}
    
    let shotsReceived = 0
    
    if (hcp < 0) {
        shotsReceived = 19 + hcp > si ? 0 : -1
    } else if (hcp > 0) {
        const shotsEveryHole = Math.trunc(hcp / 18)
        const shotsThisHole = hcp % 18 >= si ? 1 : 0
        shotsReceived = shotsEveryHole + shotsThisHole
    }
    
    const netStrokes = strokes - shotsReceived

    return netStrokes 
}

const libbetsCard = [
    {holeNo: 1, par: 4, strokeIndex: 12},
    {holeNo: 2, par: 5, strokeIndex: 6},
    {holeNo: 3, par: 4, strokeIndex: 2},
    {holeNo: 4, par: 3, strokeIndex: 16},
    {holeNo: 5, par: 5, strokeIndex: 4},
    {holeNo: 6, par: 4, strokeIndex: 14},
    {holeNo: 7, par: 4, strokeIndex: 8},
    {holeNo: 8, par: 3, strokeIndex: 18},
    {holeNo: 9, par: 4, strokeIndex: 10},
    {holeNo: 10, par: 4, strokeIndex: 9},
    {holeNo: 11, par: 4, strokeIndex: 1},
    {holeNo: 12, par: 4, strokeIndex: 11},
    {holeNo: 13, par: 4, strokeIndex: 13},
    {holeNo: 14, par: 4, strokeIndex: 3},
    {holeNo: 15, par: 3, strokeIndex: 15},
    {holeNo: 16, par: 5, strokeIndex: 7},
    {holeNo: 17, par: 3, strokeIndex: 17},
    {holeNo: 18, par: 5, strokeIndex: 5},
]

export const scorecardRouter = createTRPCRouter({
    addMany: adminProcedure
        .input(z.object({compId: z.string(), entrantId: z.number(), handicap: z.number(), stableford: z.boolean(), holes: z.object({ holeNo: z.number(), strokes: z.number().optional(), NR: z.boolean() }).array()}).array())
        .mutation(async ({ ctx, input }) => {

            await ctx.db.$transaction(input.map(sc => {
                 return ctx.db.compEntrant.update({
                    where: {
                        compId_entrantId: {
                            compId: sc.compId,
                            entrantId: sc.entrantId
                        }
                    },
                    data: {
                        scorecard: {
                            create: {
                                handicap: sc.handicap,
                                stableford: sc.stableford,
                                holes: {
                                    createMany: {
                                        data: sc.holes.map(hole => {
                                            return { 
                                                holeNo: hole.holeNo, 
                                                par: libbetsCard[hole.holeNo - 1]?.par ?? 4,
                                                strokeIndex: libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19,
                                                strokes: hole.strokes,
                                                NR: hole.NR,
                                                points: CalculatePoints(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR ),
                                                net: CalculateNet(hole.strokes, libbetsCard[hole.holeNo - 1]?.par ?? 4, libbetsCard[hole.holeNo - 1]?.strokeIndex ?? 19, sc.handicap, hole.NR )
                                            }
                                        })

                                    }
                                }
                            }
                        }
                    }
                 })
                
                
            }))
            
            
        
      
        }),
})