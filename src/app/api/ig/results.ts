"use server";

import puppeteer, { type PuppeteerLaunchOptions, type Browser } from "puppeteer";
import { api } from "~/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { z } from 'zod'


export type ScrapedResultsType = {
  comp: string
  compFormat: string
  scrapedResults: {igPosition: number, entrantName: string, score: string}[]
}

export type ScrapedResultsCheckType = {
  results: ScrapedResultsType,
  resultsObject: {
    compEntrants: CompEntrantType[],
    teamPoints: TeamPointsType[],
    transactions: TransactionType[],
    compId: string
  }
  checks: {
    missingEntrants: EntrantType[],
    noShows: EntrantType[],
    missingWildcards: TeamType[]
  }
}

export type CompEntrantType = {
  compId: string,
  entrantId: number,
  entrantName: string,
  teamName: string,
  position: number | null,
  igPosition: number | null,
  score: number | null,
  teamScore: number | null,
  noResult: boolean,
  wildcard: boolean
}

export type TeamPointsType = {
  teamId: string,
  teamName: string,
  igCompId: string,
  points: number,
  bestScore: number,
  secondScore: number,
  bestFinish: number
}

type TeamResultsType = {
  team: string,
  teamName: string,
  bestFinish: number,
  bestScore: number,
  secondScore: number,
  position: number,
  points: number,
  wildcard: string

}

export type TransactionType = {
  entrantId: number,
  entrantName: string,
  amount: number,
  description: string,
  type: "DR" | "CR",
  netAmount: number,
  igCompId: string | null,
  winnings: boolean
}

export type EntrantType = {
  id: number,
  name: string
}

export type TeamType = {
  teamId: string,
  teamName: string
}
function ensure<T>(argument: T | undefined | null, message = 'This value was promised to be there.'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}

export async function GetResults(compId: string): Promise<ScrapedResultsType> {
  const { sessionClaims } = auth();
  if (!sessionClaims?.metadata.adminPermission) throw new Error('NOT AUTHORIZED')
  const returnData: ScrapedResultsType = {
    comp: compId,
    compFormat: '',
    scrapedResults: []
  }
  const urlStub = 'https://redlibbets.intelligentgolf.co.uk/'
  const url = `${urlStub}competition.php?compid=${compId}`;
  
  const BrowserArgsSchema = z.object({ executablePath: z.string().optional(), args: z.string().array().optional(), headless: z.boolean().optional() })  
  const browserArgs: PuppeteerLaunchOptions = BrowserArgsSchema.parse(JSON.parse(process.env.PUPPETEER_BROWSER_ARGS ?? '{}'))
  const browser = await puppeteer.launch(browserArgs);
  const page = await browser.newPage();
  await page.goto(url);
  const loginElement = await page.waitForSelector("#login");
  if (loginElement) {
    //enter login details
    const userId = process.env.IG_USER ?? ""
    const pin = process.env.IG_PIN ?? ""
    await page.locator("#memberid").fill(userId);
    await page.locator("#pin").fill(pin);
    await page.locator('input.btn').click()
  }
  //check that we have results on the page
  const statsLink = page.locator('//a[contains(text(), "View Statistics for this Competition")]')
  if (statsLink) {
    //wait for page to finish loading
    await page.waitForSelector('.main-footer')
    const format = await page.$eval('thead>tr>td:nth-child(2)', el => {return el.innerText})
    format === "Points" ? returnData.compFormat = "Stableford" : returnData.compFormat = "Medal"
    const results: string[][]  = await page.$$eval('tbody>tr', rows => {
        return Array.from(rows, row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText)
        })
    })
    
    //possible one liner for the above-----------
    //let results = await page.$eval('table tbody', tbody => [...tbody.rows].map(r => [...r.cells].map(c => c.innerText)))
    //-------------------------------------------

    const parsedResults = results.map((result, index) => {
      return {
        igPosition: index + 1,
        entrantName: (result[1]?.substring(0,result[1].indexOf("(")).trim().replace(/[\u200B-\u200D\uFEFF]/g, '') ?? 'Missing'),
        score: (result[2] ?? "")
      }
    })
    returnData.scrapedResults = parsedResults
  }
  await browser.close();
  return returnData
}








export async function ProcessResults(compId: string): Promise<ScrapedResultsCheckType> {
  const { sessionClaims } = auth();
  if (!sessionClaims?.metadata.adminPermission) throw new Error('NOT AUTHORISED')
  // const compEntrants = await api.comp.getEntrants({ comp: compId })
  // const allEntrants = await api.entrant.getAll()
  // const igResults = await GetResults(compId)
  const [compEntrants, allEntrants, igResults] = await Promise.all([
    api.comp.getEntrants({ comp: compId }),
    api.entrant.getAll(),
    GetResults(compId)
  ])
  // wildcard adjustment variable - used after this to check whether medal or stableford
  const wildcardAdjustment = igResults.compFormat === "Medal" ? -3 : 3
  
  // Set variables to hold
  const results: typeof compEntrants = []
  const teams = await api.team.getList()
  const teamResults: TeamResultsType[] = []
  teams.map(team => teamResults.push({
    team: team.id,
    teamName: team.teamName,
    bestFinish: 0,
    bestScore: wildcardAdjustment > 0 ? 0 : 200,
    secondScore: wildcardAdjustment > 0 ? 0 : 200,
    position: 0,
    points: 0,
    wildcard: ""
  }))
  // const teamResults = [
  //   {team: 'BB', teamName: "Bogey Boys", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},
  //   {team: 'BD', teamName: "Balls Deep", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},
  //   {team: 'BS', teamName: "Big Sticks", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},
  //   {team: 'EU', teamName: "Eurekas", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},
  //   {team: 'RF', teamName: "Regular Flex", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},
  //   {team: 'SH', teamName: "Shanks and Big Hook", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},
  //   {team: 'SW', teamName: "Swingers", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},
  //   {team: '2B', teamName: "Two Ballers", bestFinish: 0, bestScore: wildcardAdjustment > 0 ? 0 : 200, secondScore: wildcardAdjustment > 0 ? 0 : 200, position: 0, points: 0, wildcard: ""},

  // ]
  const missingEntrants: typeof allEntrants = []
  const noShows: typeof allEntrants= []
  

  //work out which entrants aren't in the comp and which are - recording their results
  igResults.scrapedResults.forEach(result => {
    const match = compEntrants.filter(compEntrant => {
      // if (noMatches.includes(compEntrant.entrant.name) || noMatches.includes(result.entrantName)) {
      //   console.log("IG", `${result.entrantName}(${result.entrantName.length})`, "DB", `${compEntrant.entrant.name}(${compEntrant.entrant.name.length})`, "Match?", (result.entrantName === compEntrant.entrant.name))
      // }
      return compEntrant.entrant.name == result.entrantName
    })
    if (match.length === 1 && match[0]) {
      
      const m = match[0]
      m.igPosition = result.igPosition
      const ScoreSchema = z.coerce.number()
      if (ScoreSchema.safeParse(result.score).success) {

        m.score = parseInt(result.score)
        m.wildcard ? m.teamScore = parseInt(result.score) + wildcardAdjustment : m.teamScore = parseInt(result.score)
      } else {
        m.noResult = true
      }
      
      results.push(m)
    } else {
      
      const missing = allEntrants.findIndex(entrant => (entrant.name == result.entrantName))
      if (missing != -1) {
        missingEntrants.push( ensure(allEntrants[missing]))
      } 
    }
  })

  
  //Find NoShows!
  compEntrants.forEach(entrant => {
    const match = igResults.scrapedResults.filter(result => (result.entrantName === entrant.entrant.name))
    if (match.length === 0) {
      const ent = allEntrants.filter(entr => (entr.id === entrant.entrantId))
      noShows.push(ensure(ent[0]))
    }
  })
  
  
  //add positions and record team scores
  results.forEach((result, index) => {
    result.position = index + 1
    const teamIndex = teamResults.findIndex(teamResult => {
      return teamResult.team === result.entrant.teamId})
    
      const teamResult = ensure(teamResults[teamIndex])
      if (result.wildcard) {teamResult.wildcard = result.entrant.name}
    // If first score for a team, must be their highest finish
      if (teamResult && teamResult?.bestFinish === 0) {
      teamResult.bestFinish = (result.igPosition ?? 0)
    }
    const teamScore = result.teamScore ? result.teamScore : wildcardAdjustment > 0 ? 0 : 200
    console.log(`${result.entrant.name}: ${result.teamScore} - teamScore: ${teamScore}`)
    if (teamResult && ((teamScore * wildcardAdjustment) > (teamResult.bestScore * wildcardAdjustment))) {
      //if score better than best score, move best score to second and record new best
      //Mst allow for medal where better score is a lower score. Check wildcardAdjustment < 0 = medal
      teamResult.secondScore = teamResult.bestScore
      teamResult.bestScore = teamScore
    } else if (teamResult && ((teamScore * wildcardAdjustment) > (teamResult.secondScore * wildcardAdjustment))) {
      teamResult.secondScore = teamScore
    }
      
  })


  //find top scoring teams
  teamResults.sort((a, b) => {
    if (igResults.compFormat === 'Medal') {
      return (a.bestScore + a.secondScore + 0.01 * a.bestFinish) - (b.bestScore + b.secondScore + 0.01 * b.bestFinish)
    } 
    return (b.bestScore + b.secondScore - 0.01 * b.bestFinish) - (a.bestScore + a.secondScore - 0.01 * a.bestFinish)
  })
  teamResults.forEach((team, index) => {
    team.position = index + 1
    // team.points = 8 - index
    team.points = teams.length - index
  })
  

  //Find winning team
  const winningTeam = teamResults[0]
  const refundEntrants = results.filter(result => {
    return result.entrant.teamId === winningTeam?.team
  })
 
  const entrantCount = compEntrants.length
  const prizesCount = entrantCount - refundEntrants.length
  const prizesLookup = prizesCount * 500
  const prizeBreakdown = await api.prizes.get({ prizePot: prizesLookup})
  const prizes = []
  if (prizeBreakdown) {
    prizes.push({...results[0], prize: prizeBreakdown.first, prizeDescription: "1st Place Winnings"})
    prizes.push({...results[1], prize: prizeBreakdown.second, prizeDescription: "2nd Place Winnings"})
    if (prizeBreakdown?.third) {prizes.push({...results[2], prize: prizeBreakdown.third, prizeDescription: "3rd Place Winnings"})}
    if (prizeBreakdown?.fourth) {prizes.push({...results[3], prize: prizeBreakdown.fourth, prizeDescription: "4th Place Winnings"})}
    if (prizeBreakdown?.fifth) {prizes.push({...results[4], prize: prizeBreakdown.fifth, prizeDescription: "5th Place Winnings"})}
  }
  

  const returnObject = {
    results: igResults,
    resultsObject: {
      compEntrants: results.map(result => ({
        entrantId: result.entrantId,
        entrantName: result.entrant.name,
        teamName: result.entrant.teamId,
        compId: result.compId,
        position: result.position,
        igPosition: result.igPosition,
        provisionalScore: result.provisionalScore,
        score: result.score,
        teamScore: result.teamScore,
        noResult: result.noResult,
        wildcard: result.wildcard
      })),
      teamPoints: teamResults.map(teamResult => (
        {teamId: teamResult.team,
          teamName: teamResult.teamName,
          igCompId: compId,
          points: teamResult.points,
          bestScore: teamResult.bestScore,
          secondScore: teamResult.secondScore,
          bestFinish: teamResult.bestFinish

        }
      )),
      transactions: [...prizes.map(prize => ({
        entrantId: prize.entrantId ?? 0,
        entrantName: prize.entrant?.name ?? "",
        amount: prize.prize,
        description: prize.prizeDescription,
        type: "CR" as "CR" | "DR",
        netAmount: prize.prize,
        igCompId: compId,
        winnings: true, 
      })), ...refundEntrants.map(refund => ({
        entrantId: refund.entrantId,
        entrantName: refund.entrant?.name || "",
        amount: 500,
        description: "Winning Team",
        type: "CR" as "CR" | "DR",
        netAmount: 500,
        igCompId: compId,
        winnings: true
      })) ],
      compId: compId
    },
    checks: {
      missingEntrants: missingEntrants,
      noShows: noShows,
      missingWildcards: teamResults.filter(team => (team.wildcard === '')).map(teamResult => ({
        teamId: teamResult.team,
        teamName: teamResult.teamName
      }))
    }
  }

  return returnObject
}




// export async function AddMissingCompEntrants(compId: string, compEntrantIds: number[]) {
//   const { sessionClaims } = auth();
//   if (!sessionClaims?.metadata.adminPermission) throw new Error('NOT AUTHORISED')
//   console.log("=============Adding missing entrants=========")
//   try {
//     compEntrantIds.forEach(async (missingEntrant) => {
//       await api.comp.enterSomeoneElse({ comp: compId, entrantId: missingEntrant})
//     })
//   } catch (err) {
//     if (err instanceof Error) console.log(err.message)
//   }
  
// }

export type EclecticScore = {
  hole: number
  score: string | null
}

export type ScrapedEclecticType = {
  comp: string
  compFormat: string
  scrapedResults: { entrantName: string, link: string}[]
  scrapedScores: { entrant: string, entrantId?: number, handicap: string, scores: EclecticScore[]}[]
}

// export type ScrapedEclecticScore = {
//   entrant: string
//   scores: {
//   hole: number
//   score: string | null
//   }[]
// }


export async function GetEclectic(compId: string): Promise<ScrapedEclecticType> {
  const { sessionClaims } = auth();
  if (!sessionClaims?.metadata.adminPermission) throw new Error('NOT AUTHORISED')
  const returnData: ScrapedEclecticType = {
    comp: compId,
    compFormat: '',
    scrapedResults: [],
    scrapedScores: []
  }
  //Get list of Entrants so we can map their Lib entrantIds
  const entrants = await api.entrant.getList()

  const urlStub = 'https://redlibbets.intelligentgolf.co.uk/'
  const url = `${urlStub}competition.php?compid=${compId}`;
  let browser: Browser | undefined
  try {
    // browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome',args: ['--no-sandbox', '--disable-setuid-sandbox'] }, );
    const BrowserArgsSchema = z.object({ executablePath: z.string().optional(), args: z.string().array().optional(), headless: z.boolean().optional() })  
  const browserArgs: PuppeteerLaunchOptions = BrowserArgsSchema.parse(JSON.parse(process.env.PUPPETEER_BROWSER_ARGS ?? '{}'))
const browser = await puppeteer.launch(browserArgs);
    
    const page = await browser.newPage();
    await page.goto(url);
    const loginElement = await page.waitForSelector("#login");
    if (loginElement) {
      //enter login details
      const userId = process.env.IG_USER ?? ""
      const pin = process.env.IG_PIN ?? ""
      await page.locator("#memberid").fill(userId);
      await page.locator("#pin").fill(pin);
      await page.locator('input.btn').click()
    }
    //check that we have results on the page
    const statsLink = page.locator('//a[contains(text(), "View Statistics for this Competition")]')
    if (statsLink) {
      //wait for page to finish loading
      await page.waitForSelector('.main-footer')
      const format = await page.$eval('thead>tr>td:nth-child(2)', el => {return el.innerText})
      format === "Points" ? returnData.compFormat = "Stableford" : returnData.compFormat = "Medal"
      const results: string[][]  = await page.$$eval('tbody>tr', rows => {
        return Array.from(rows, row => {
          const columns = row.querySelectorAll('td>a');
          return Array.from(columns, column => {
            const href = column.getAttribute('href') ?? ""
            
            if (href?.startsWith("viewround")) {
              return href
            } else {
              return column.textContent?.replace(/[\u200B-\u200D\uFEFF]/g, '').replace("  ", " ") ?? ""
            }
            
          })
        })
      })
      
      //possible one liner for the above-----------
      //let results = await page.$eval('table tbody', tbody => [...tbody.rows].map(r => [...r.cells].map(c => c.innerText)))
      //-------------------------------------------
      
      const parsedResults = results.map((result) => {
        return {
          entrantName: (result[0]?.trim().replace(/[\u200B-\u200D\uFEFF]/g, '') ?? 'Stableford'),
          fullEntrantName: result,
          link: (`${urlStub}${result[1]}` || "")
        }
      })
      returnData.scrapedResults = parsedResults
    }
    for (const result of returnData.scrapedResults) {
      await page.goto(result.link)
      await page.waitForSelector(".club-footer");
      const scrape = { entrant: result.entrantName, entrantId: entrants.filter((ent) => {return ent.name === result.entrantName})[0]?.id ?? undefined, handicap: "", scores: [] as EclecticScore[]}
      const hcp = await page.$eval('#rounds>table>thead>tr>td:nth-child(1)', el => {return el.textContent})
      // if (hcp) console.log("handicap element", hcp, typeof(hcp))
        if (hcp) {
          const chop = hcp.trim().replace(/[\u200B-\u200D\uFEFF]/g, '').substring(result.entrantName.length)
          scrape.handicap =  chop.substring(chop.indexOf("(")+1,chop.indexOf(")"))
          
        } 
        const scores = await page.$$eval('#rounds>table:nth-child(1)>tbody>tr:nth-child(5)>td>span', (elems: HTMLSpanElement[]) => {
          return Array.from(elems, (elem, index) => {
            return { hole: index + 1, score: elem.textContent }
          })
        })
        
        scrape.scores = scores as EclecticScore[]
        returnData.scrapedScores.push(scrape)
        
      }
      
    } finally {
      if (typeof(browser) !== 'undefined') await browser.close();
      
    }
    
    return returnData 
}