import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Add Teams=============================================
  const bogey = await prisma.team.upsert({
    where: { id: 'BB' },
    update: {},
    create: {
        id: 'BB',
        teamName: 'Bogey Boys',
        linkName: 'bogeyboys',
    },
  })

  const eurekas = await prisma.team.upsert({
    where: { id: 'EU' },
    update: {},
    create: {
        id: 'EU',
        teamName: 'Eurekas',
        linkName: 'eurekas',
    },
  })

  const bigSticks = await prisma.team.upsert({
    where: { id: 'BS' },
    update: {},
    create: {
        id: 'BS',
        teamName: 'Big Sticks',
        linkName: 'bigsticks',
    },
  })

  const balls = await prisma.team.upsert({
    where: { id: 'BD' },
    update: {},
    create: {
        id: 'BD',
        teamName: 'Balls Deep',
        linkName: 'ballsdeep',
    },
  })

  const swingers = await prisma.team.upsert({
    where: { id: 'SW' },
    update: {},
    create: {
        id: 'SW',
        teamName: 'Swingers',
        linkName: 'swingers',
    },
  })

  const flex = await prisma.team.upsert({
    where: { id: 'RF' },
    update: {},
    create: {
        id: 'RF',
        teamName: 'Regular Flex',
        linkName: 'regularflex',
    },
  })

  const shanks = await prisma.team.upsert({
    where: { id: 'SH' },
    update: {},
    create: {
        id: 'SH',
        teamName: 'Shanks and Big Hook',
        linkName: 'shanksandbighook',
    },
  })

  const twoball = await prisma.team.upsert({
    where: { id: '2B' },
    update: {},
    create: {
        id: '2B',
        teamName: 'Two Ballers',
        linkName: 'twoballers',
    },
  })
  
  console.log({bogey, eurekas, bigSticks, balls, swingers, flex, shanks, twoball})


  // Add Entrants============================================================
  const danny = await prisma.entrant.upsert({
    where: { name: 'Danny Innes'},
    update: {},
    create: {
        name: 'Danny Innes',
        systemName: 'Danny Innes',
        teamId: 'BD',
        captain: false,
        compPermission: false,
        entryPermission: false,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const tom = await prisma.entrant.upsert({
    where: { name: 'Tom Whitelaw'},
    update: {},
    create: {
        name: 'Tom Whitelaw',
        systemName: 'Tom Whitelaw',
        teamId: 'BD',
        captain: true,
        entryPermission: true,
        compPermission: true,
        adminPermission: true,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const cod = await prisma.entrant.upsert({
    where: { name: "Chris O'Donoghue"},
    update: {},
    create: {
        name: "Chris O'Donoghue",
        systemName: "Chris O'Donoghue",
        teamId: 'SW',
        captain: true,
        entryPermission: true,
        compPermission: true,
        adminPermission: true,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const kyle = await prisma.entrant.upsert({
    where: { name: 'Kyle Deane'},
    update: {},
    create: {
        name: 'Kyle Deane',
        systemName: 'Kyle Deane',
        teamId: 'BB',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const terry = await prisma.entrant.upsert({
    where: { name: 'Terry Hare'},
    update: {},
    create: {
        name: 'Terry Hare',
        systemName: 'Terence Hare',
        teamId: 'EU',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const anthony = await prisma.entrant.upsert({
    where: { name: 'Anthony Elisak'},
    update: {},
    create: {
        name: 'Anthony Elisak',
        systemName: 'Anthony Elisak',
        teamId: '2B',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const dix = await prisma.entrant.upsert({
    where: { name: 'Steve Dixon'},
    update: {},
    create: {
        name: 'Steve Dixon',
        systemName: 'Steve Dixon',
        teamId: 'SH',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const suki = await prisma.entrant.upsert({
    where: { name: 'Suki Saran'},
    update: {},
    create: {
        name: 'Suki Saran',
        systemName: 'Suki Saran',
        teamId: 'BS',
        captain: true,
        transactions: {
            create: [{
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            },
            {
                amount: 5550,
                description: 'Balance from 2024',
                type: 'CR',
                netAmount: 5550,
                createdAt: '2025-03-01T01:00:00.000Z'
            },]
        }
    },
  })

  const dish = await prisma.entrant.upsert({
    where: { name: 'David Washer'},
    update: {},
    create: {
        name: 'David Washer',
        systemName: 'David Washer',
        teamId: 'RF',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const graham = await prisma.entrant.upsert({
    where: { name: 'Graham Marshall'},
    update: {},
    create: {
        name: 'Graham Marshall',
        systemName: 'Graham Marshall',
        teamId: 'BD',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })


  const lee = await prisma.entrant.upsert({
    where: { name: 'Lee Merryweather'},
    update: {},
    create: {
        name: 'Lee Merryweather',
        systemName: 'Lee Merryweather',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const randip = await prisma.entrant.upsert({
    where: { name: 'Randip Gill'},
    update: {},
    create: {
        name: 'Randip Gill',
        systemName: 'Randip Gill',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const fordey = await prisma.entrant.upsert({
    where: { name: 'Simon Forde'},
    update: {},
    create: {
        name: 'Simon Forde',
        systemName: 'Simon Forde',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: [{
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            },
            {
                amount: 2800,
                description: 'Balance from 2024',
                type: 'CR',
                netAmount: 2800,
                createdAt: '2025-03-01T01:00:00.000Z'
            },
        ]
        }
    },
  })

  const smithy = await prisma.entrant.upsert({
    where: { name: 'Ian Smith'},
    update: {},
    create: {
        name: 'Ian Smith',
        systemName: 'Ian R Smith',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const jethro = await prisma.entrant.upsert({
    where: { name: 'Tom Jeffrey'},
    update: {},
    create: {
        name: 'Tom Jeffrey',
        systemName: 'Thomas Jeffrey',
        teamId: '2B',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })



  const dj = await prisma.entrant.upsert({
    where: { name: 'Duncan Jenner'},
    update: {},
    create: {
        name: 'Duncan Jenner',
        systemName: 'Duncan Jenner',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })




  const tony = await prisma.entrant.upsert({
    where: { name: 'Tony Money'},
    update: {},
    create: {
        name: 'Tony Money',
        systemName: 'Anthony Money',
        teamId: '2B',
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const greeney = await prisma.entrant.upsert({
    where: { name: 'Peter Greene'},
    update: {},
    create: {
        name: 'Peter Greene',
        systemName: 'Peter Greene',
        teamId: 'BB',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const salvage = await prisma.entrant.upsert({
    where: { name: 'Paul Salvage'},
    update: {},
    create: {
        name: 'Paul Salvage',
        systemName: 'Paul Salvage',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const darren = await prisma.entrant.upsert({
    where: { name: 'Darren Read'},
    update: {},
    create: {
        name: 'Darren Read',
        systemName: 'Darren James Read',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const john = await prisma.entrant.upsert({
    where: { name: 'John Ashen'},
    update: {},
    create: {
        name: 'John Ashen',
        systemName: 'John Ashen',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })


  const ben = await prisma.entrant.upsert({
    where: { name: 'Ben Pettet'},
    update: {},
    create: {
        name: 'Ben Pettet',
        systemName: 'Ben Pettet',
        teamId: 'RF',
        captain: false,
        transactions: {
            create: [{
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            },
            {
                amount: 4000,
                description: 'Balance from 2024',
                type: 'CR',
                netAmount: 4000,
                createdAt: '2025-03-01T01:00:00.000Z'
            },
        ]
        }
    },
  })

  const chris = await prisma.entrant.upsert({
    where: { name: 'Chris Stevens'},
    update: {},
    create: {
        name: 'Chris Stevens',
        systemName: 'Chris Stevens',
        teamId: '2B',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const greg = await prisma.entrant.upsert({
    where: { name: 'Greg Hammond'},
    update: {},
    create: {
        name: 'Greg Hammond',
        systemName: 'Greg Hammond',
        teamId: 'BB',
        captain: false,
        compPermission: true,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const chef = await prisma.entrant.upsert({
    where: { name: 'Tony Delaney'},
    update: {},
    create: {
        name: 'Tony Delaney',
        systemName: 'Tony Delaney',
        teamId: 'BD',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const justin = await prisma.entrant.upsert({
    where: { name: 'Justin Gledhill-Carr'},
    update: {},
    create: {
        name: 'Justin Gledhill-Carr',
        systemName: 'Justin Gledhill-Carr',
        teamId: 'RF',
        captain: false,
        transactions: {
            create: [
                {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            },
            {
                amount: 3500,
                description: 'Balance from 2024',
                type: 'CR',
                netAmount: 3500,
                createdAt: '2025-03-01T01:00:00.000Z'
            },
        ]
        }
    },
  })


  const malk = await prisma.entrant.upsert({
    where: { name: 'Malk Dhami'},
    update: {},
    create: {
        name: 'Malk Dhami',
        systemName: 'Malkinder Dhami',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })


  const lokesh = await prisma.entrant.upsert({
    where: { name: 'Lokesh Patel'},
    update: {},
    create: {
        name: 'Lokesh Patel',
        systemName: 'Lokesh Patel',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const jamie = await prisma.entrant.upsert({
    where: { name: 'Jamie Bartlett'},
    update: {},
    create: {
        name: 'Jamie Bartlett',
        systemName: 'James Bartlett',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const kelvin = await prisma.entrant.upsert({
    where: { name: 'Kelvin Munroe'},
    update: {},
    create: {
        name: 'Kelvin Munroe',
        systemName: 'Kelvin Munroe',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: [
                {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            },
            {
                amount: 1500,
                description: 'Balance from 2024',
                type: 'CR',
                netAmount: 1500,
                createdAt: '2025-03-01T01:00:00.000Z'
            },
        ]
        }
    },
  })

  const linas = await prisma.entrant.upsert({
    where: { name: 'Linas Bumblys'},
    update: {},
    create: {
        name: 'Linas Bumblys',
        systemName: 'Linas Bumblys',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const sam = await prisma.entrant.upsert({
    where: { name: 'Sam Ryan'},
    update: {},
    create: {
        name: 'Sam Ryan',
        systemName: 'Sam Ryan',
        teamId: 'BB',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const charlie = await prisma.entrant.upsert({
    where: { name: 'Charlie French'},
    update: {},
    create: {
        name: 'Charlie French',
        systemName: 'Charlie French',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const doe = await prisma.entrant.upsert({
    where: { name: 'Ben Doe'},
    update: {},
    create: {
        name: 'Ben Doe',
        systemName: 'Ben Doe',
        teamId: 'BB',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const henry = await prisma.entrant.upsert({
    where: { name: 'Henry Jackson'},
    update: {},
    create: {
        name: 'Henry Jackson',
        systemName: 'Henry Jackson',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const danb = await prisma.entrant.upsert({
    where: { name: 'Dan Blatchford'},
    update: {},
    create: {
        name: 'Dan Blatchford',
        systemName: 'Dan Blatchford',
        teamId: 'RF',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const gareth = await prisma.entrant.upsert({
    where: { name: 'Gareth Coulter'},
    update: {},
    create: {
        name: 'Gareth Coulter',
        systemName: 'Gareth Coulter',
        teamId: 'RF',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const woody = await prisma.entrant.upsert({
    where: { name: 'Paul Wood'},
    update: {},
    create: {
        name: 'Paul Wood',
        systemName: 'Paul Wood',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const craig = await prisma.entrant.upsert({
    where: { name: 'Craig Jeffrey'},
    update: {},
    create: {
        name: 'Craig Jeffrey',
        systemName: 'Craig Jeffrey',
        teamId: '2B',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })

  const browny = await prisma.entrant.upsert({
    where: { name: 'Stephen Brown'},
    update: {},
    create: {
        name: 'Stephen Brown',
        systemName: 'Stephen Brown',
        teamId: 'BD',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'Libtour Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2025-03-31T01:00:00.000Z'
            }
        }
    },
  })


  console.log({danny, tom, kyle, terry, cod,graham, lee, randip, fordey, smithy,
jethro, suki, dj, dish, tony, greeney, salvage, darren, john, ben, chris,
greg, chef, justin, malk, lokesh, jamie, kelvin, linas, sam, anthony,
dix, charlie, doe, henry, danb, gareth, woody, craig, browny
    })

    //Add Comps=========================================================

    const comp1 = await prisma.comp.upsert({
        where: { igCompId: '1997' },
        update: {},
        create: {
            igCompId: '1997',
            shortName: 'oco',
            name: 'OCO Spring Cup',
            date: '2025-04-05T01:00:00.000Z',
            stableford: true,
        }
    })

    const comp2 = await prisma.comp.upsert({
        where: { igCompId: '2070' },
        update: {},
        create: {
            igCompId: '2070',
            shortName: 'aprmedal',
            name: 'April Medal',
            date: '2025-04-13T01:00:00.000Z',
            stableford: false,
        }
    })

    const comp3 = await prisma.comp.upsert({
        where: { igCompId: '2077' },
        update: {},
        create: {
            igCompId: '2077',
            shortName: 'aprstab',
            name: 'April Stableford',
            date: '2025-04-20T01:00:00.000Z',
            stableford: true,

        }
    })

    const comp4 = await prisma.comp.upsert({
        where: { igCompId: '2000' },
        update: {},
        create: {
            igCompId: '2000',
            shortName: 'stgeorge',
            name: 'St Georges Day Cup',
            date: '2025-04-26T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp5 = await prisma.comp.upsert({
        where: { igCompId: '2080' },
        update: {},
        create: {
            igCompId: '2080',
            shortName: 'maymedal',
            name: "May Medal",
            date: '2025-05-04T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp6 = await prisma.comp.upsert({
        where: { igCompId: '2003' },
        update: {},
        create: {
            igCompId: '2003',
            shortName: 'footsie',
            name: 'The Footsie',
            date: '2025-05-18T01:00:00.000Z',
            stableford: true,

        }
    })

    const comp7 = await prisma.comp.upsert({
        where: { igCompId: '2083' },
        update: {},
        create: {
            igCompId: '2083',
            shortName: 'maystab',
            name: 'May Stableford',
            date: '2025-06-01T01:00:00.000Z',
            stableford: true,

        }
    })

    const comp8 = await prisma.comp.upsert({
        where: { igCompId: '2009' },
        update: {},
        create: {
            igCompId: '2009',
            shortName: 'foundation',
            name: 'Foundation Cup',
            date: '2025-06-08T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp9 = await prisma.comp.upsert({
        where: { igCompId: '2086' },
        update: {},
        create: {
            igCompId: '2086',
            shortName: 'junmedal',
            name: 'June Medal',
            date: '2025-06-15T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp10 = await prisma.comp.upsert({
        where: { igCompId: '2012' },
        update: {},
        create: {
            igCompId: '2012',
            shortName: 'wig',
            name: 'WIG Trophy',
            date: '2025-06-21T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp11 = await prisma.comp.upsert({
        where: { igCompId: '2089' },
        update: {},
        create: {
            igCompId: '2089',
            shortName: 'junstab',
            name: 'June Stableford',
            date: '2025-06-29T01:00:00.000Z',
            stableford: true,

        }
    })

    const comp12 = await prisma.comp.upsert({
        where: { igCompId: '2015' },
        update: {},
        create: {
            igCompId: '2015',
            shortName: 'captain',
            name: 'Captains Stableford',
            date: '2025-07-06T01:00:00.000Z',
            stableford: true,

        }
    })

    const comp13 = await prisma.comp.upsert({
        where: { igCompId: '2094' },
        update: {},
        create: {
            igCompId: '2094',
            shortName: 'julmedal',
            name: 'July Medal',
            date: '2025-07-20T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp14 = await prisma.comp.upsert({
        where: { igCompId: '2097' },
        update: {},
        create: {
            igCompId: '2097',
            shortName: 'augstab',
            name: 'August Stableford',
            date: '2025-08-03T01:00:00.000Z',
            stableford: true,

        }
    })

    const comp15 = await prisma.comp.upsert({
        where: { igCompId: '2100' },
        update: {},
        create: {
            igCompId: '2100',
            shortName: 'augmedal',
            name: 'August Medal',
            date: '2025-08-31T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp16 = await prisma.comp.upsert({
        where: { igCompId: '2029' },
        update: {},
        create: {
            igCompId: '2029',
            shortName: 'cc1',
            name: 'Club Champs Rd1',
            date: '2025-09-06T01:00:00.000Z',
            stableford: false,

        }
    })

    const comp17 = await prisma.comp.upsert({
        where: { igCompId: '2030' },
        update: {},
        create: {
            igCompId: '2030',
            shortName: 'cc2',
            name: 'Club Champs Rd2',
            date: '2025-09-07T01:00:00.000Z',
            stableford: false,

        }
    })

    



    console.log({comp1, comp2, comp3, comp4, comp5, comp6, comp7, comp8, comp9, comp10, 
        comp11, comp12, comp13, comp14, comp15, comp16, comp17, })

        //Add Prize money===============================================


    const p15 = await prisma.compPrizes.upsert({
        where: { prizePot: 1500 },
        update: {},
        create: {
            prizePot: 1500,
            first: 1000,
            second: 500
        }
    })

    const p20 = await prisma.compPrizes.upsert({
        where: { prizePot: 2000 },
        update: {},
        create: {
            prizePot: 2000,
            first: 1500,
            second: 500
        }
    })

    const p25 = await prisma.compPrizes.upsert({
        where: { prizePot: 2500 },
        update: {},
        create: {
            prizePot: 2500,
            first: 1500,
            second: 1000
        }
    })

    const p30 = await prisma.compPrizes.upsert({
        where: { prizePot: 3000 },
        update: {},
        create: {
            prizePot: 3000,
            first: 1500,
            second: 900,
            third: 600
        }
    })

    const p35 = await prisma.compPrizes.upsert({
        where: { prizePot: 3500 },
        update: {},
        create: {
            prizePot: 3500,
            first: 1750,
            second: 1050,
            third: 700
        }
    })

    const p40 = await prisma.compPrizes.upsert({
        where: { prizePot: 4000 },
        update: {},
        create: {
            prizePot: 4000,
            first: 2000,
            second: 1200,
            third: 800
        }
    })

    const p45 = await prisma.compPrizes.upsert({
        where: { prizePot: 4500 },
        update: {},
        create: {
            prizePot: 4500,
            first: 2250,
            second: 1350,
            third: 900
        }
    })

    const p50 = await prisma.compPrizes.upsert({
        where: { prizePot: 5000 },
        update: {},
        create: {
            prizePot: 5000,
            first: 2500,
            second: 1500,
            third: 1000
        }
    })

    const p55 = await prisma.compPrizes.upsert({
        where: { prizePot: 5500 },
        update: {},
        create: {
            prizePot: 5500,
            first: 2750,
            second: 1650,
            third: 1100
        }
    })

    const p60 = await prisma.compPrizes.upsert({
        where: { prizePot: 6000 },
        update: {},
        create: {
            prizePot: 6000,
            first: 3000,
            second: 1800,
            third: 1200
        }
    })

    const p65 = await prisma.compPrizes.upsert({
        where: { prizePot: 6500 },
        update: {},
        create: {
            prizePot: 6500,
            first: 3250,
            second: 1950,
            third: 1300
        }
    })

    const p70 = await prisma.compPrizes.upsert({
        where: { prizePot: 7000 },
        update: {},
        create: {
            prizePot: 7000,
            first: 3500,
            second: 2100,
            third: 1400
        }
    })

    const p75 = await prisma.compPrizes.upsert({
        where: { prizePot: 7500 },
        update: {},
        create: {
            prizePot: 7500,
            first: 3750,
            second: 2250,
            third: 1500
        }
    })

    const p80 = await prisma.compPrizes.upsert({
        where: { prizePot: 8000 },
        update: {},
        create: {
            prizePot: 8000,
            first: 4000,
            second: 2400,
            third: 1600
        }
    })

    const p85 = await prisma.compPrizes.upsert({
        where: { prizePot: 8500 },
        update: {},
        create: {
            prizePot: 8500,
            first: 4250,
            second: 2550,
            third: 1700
        }
    })

    const p90 = await prisma.compPrizes.upsert({
        where: { prizePot: 9000 },
        update: {},
        create: {
            prizePot: 9000,
            first: 4500,
            second: 2700,
            third: 1800
        }
    })

    const p95 = await prisma.compPrizes.upsert({
        where: { prizePot: 9500 },
        update: {},
        create: {
            prizePot: 9500,
            first: 4750,
            second: 2850,
            third: 1900
        }
    })

    const p100 = await prisma.compPrizes.upsert({
        where: { prizePot: 10000 },
        update: {},
        create: {
            prizePot: 10000,
            first: 5000,
            second: 3000,
            third: 2000
        }
    })

    const p105 = await prisma.compPrizes.upsert({
        where: { prizePot: 10500 },
        update: {},
        create: {
            prizePot: 10500,
            first: 5000,
            second: 3000,
            third: 2000,
            fourth: 500
        }
    })

    const p110 = await prisma.compPrizes.upsert({
        where: { prizePot: 11000 },
        update: {},
        create: {
            prizePot: 11000,
            first: 5000,
            second: 3000,
            third: 2000,
            fourth: 1000
        }
    })

    const p115 = await prisma.compPrizes.upsert({
        where: { prizePot: 11500 },
        update: {},
        create: {
            prizePot: 11500,
            first: 5000,
            second: 3000,
            third: 2000,
            fourth: 1500
        }
    })

    const p120 = await prisma.compPrizes.upsert({
        where: { prizePot: 12000 },
        update: {},
        create: {
            prizePot: 12000,
            first: 5000,
            second: 3000,
            third: 2000,
            fourth: 1500,
            fifth: 500
        }
    })

    const p125 = await prisma.compPrizes.upsert({
        where: { prizePot: 12500 },
        update: {},
        create: {
            prizePot: 12500,
            first: 5000,
            second: 3000,
            third: 2000,
            fourth: 1500,
            fifth: 1000
        }
    })

    const p130 = await prisma.compPrizes.upsert({
        where: { prizePot: 13000 },
        update: {},
        create: {
            prizePot: 13000,
            first: 5000,
            second: 3500,
            third: 2000,
            fourth: 1500,
            fifth: 1000
        }
    })

    const p135 = await prisma.compPrizes.upsert({
        where: { prizePot: 13500 },
        update: {},
        create: {
            prizePot: 13500,
            first: 5000,
            second: 3500,
            third: 2500,
            fourth: 1500,
            fifth: 1000
        }
    })

    const p140 = await prisma.compPrizes.upsert({
        where: { prizePot: 14000 },
        update: {},
        create: {
            prizePot: 14000,
            first: 5000,
            second: 3500,
            third: 2500,
            fourth: 2000,
            fifth: 1000
        }
    })

    const p145 = await prisma.compPrizes.upsert({
        where: { prizePot: 14500 },
        update: {},
        create: {
            prizePot: 14500,
            first: 5000,
            second: 3500,
            third: 2500,
            fourth: 2000,
            fifth: 1500
        }
    })

    const p150 = await prisma.compPrizes.upsert({
        where: { prizePot: 15000 },
        update: {},
        create: {
            prizePot: 15000,
            first: 5000,
            second: 4000,
            third: 2500,
            fourth: 2000,
            fifth: 1500
        }
    })

    const p155 = await prisma.compPrizes.upsert({
        where: { prizePot: 15500 },
        update: {},
        create: {
            prizePot: 15500,
            first: 5000,
            second: 4000,
            third: 3000,
            fourth: 2000,
            fifth: 1500
        }
    })

    const p160 = await prisma.compPrizes.upsert({
        where: { prizePot: 16000 },
        update: {},
        create: {
            prizePot: 16000,
            first: 5000,
            second: 4000,
            third: 3000,
            fourth: 2500,
            fifth: 1500
        }
    })

    const p165 = await prisma.compPrizes.upsert({
        where: { prizePot: 16500 },
        update: {},
        create: {
            prizePot: 16500,
            first: 5000,
            second: 4000,
            third: 3000,
            fourth: 2500,
            fifth: 2000
        }
    })

    const p170 = await prisma.compPrizes.upsert({
        where: { prizePot: 17000 },
        update: {},
        create: {
            prizePot: 17000,
            first: 5500,
            second: 4000,
            third: 3000,
            fourth: 2500,
            fifth: 2000
        }
    })

    const p175 = await prisma.compPrizes.upsert({
        where: { prizePot: 17500 },
        update: {},
        create: {
            prizePot: 17500,
            first: 5500,
            second: 4000,
            third: 3500,
            fourth: 2500,
            fifth: 2000
        }
    })

    const p180 = await prisma.compPrizes.upsert({
        where: { prizePot: 18000 },
        update: {},
        create: {
            prizePot: 18000,
            first: 5500,
            second: 4000,
            third: 3500,
            fourth: 3000,
            fifth: 2000
        }
    })

    const p185 = await prisma.compPrizes.upsert({
        where: { prizePot: 18500 },
        update: {},
        create: {
            prizePot: 18500,
            first: 5500,
            second: 4000,
            third: 3500,
            fourth: 3000,
            fifth: 2500
        }
    })

    const p190 = await prisma.compPrizes.upsert({
        where: { prizePot: 19000 },
        update: {},
        create: {
            prizePot: 19000,
            first: 6000,
            second: 4000,
            third: 3500,
            fourth: 3000,
            fifth: 2500
        }
    })


    console.log(p15, p20, p25, p30, p35, p40, p45, p50, p55, p60, p65, p70, p75, p80,
        p85, p90, p95, p100, p105, p110, p115, p120, p125, p130, p135, p140, p145, p150,
        p155, p160, p165, p170, p175, p180, p185, p190)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })