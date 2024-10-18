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
        teamName: 'Lost Balls',
        linkName: 'lostballs',
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
        teamId: 'BS',
        captain: true,
        compPermission: true,
        entryPermission: true,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const tom = await prisma.entrant.upsert({
    where: { name: 'Tom Whitelaw'},
    update: {},
    create: {
        name: 'Tom Whitelaw',
        teamId: 'BD',
        captain: true,
        entryPermission: true,
        compPermission: true,
        adminPermission: true,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const cod = await prisma.entrant.upsert({
    where: { name: "Chris O'Donoghue"},
    update: {},
    create: {
        name: "Chris O'Donoghue",
        teamId: 'SW',
        captain: true,
        entryPermission: true,
        compPermission: true,
        adminPermission: true,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const kyle = await prisma.entrant.upsert({
    where: { name: 'Kyle Deane'},
    update: {},
    create: {
        name: 'Kyle Deane',
        teamId: 'BB',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const terry = await prisma.entrant.upsert({
    where: { name: 'Terence Hare'},
    update: {},
    create: {
        name: 'Terence Hare',
        teamId: 'EU',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const robbie = await prisma.entrant.upsert({
    where: { name: 'Robbie Howe'},
    update: {},
    create: {
        name: 'Robbie Howe',
        teamId: 'RF',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const graham = await prisma.entrant.upsert({
    where: { name: 'Graham Marshall'},
    update: {},
    create: {
        name: 'Graham Marshall',
        teamId: 'SH',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const james = await prisma.entrant.upsert({
    where: { name: 'James Reynolds'},
    update: {},
    create: {
        name: 'James Reynolds',
        teamId: '2B',
        captain: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const lee = await prisma.entrant.upsert({
    where: { name: 'Lee Merryweather'},
    update: {},
    create: {
        name: 'Lee Merryweather',
        teamId: 'BD',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const randip = await prisma.entrant.upsert({
    where: { name: 'Randip Gill'},
    update: {},
    create: {
        name: 'Randip Gill',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const fordey = await prisma.entrant.upsert({
    where: { name: 'Simon Forde'},
    update: {},
    create: {
        name: 'Simon Forde',
        teamId: 'BD',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const smithy = await prisma.entrant.upsert({
    where: { name: 'Ian R Smith'},
    update: {},
    create: {
        name: 'Ian R Smith',
        teamId: 'BD',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const jethro = await prisma.entrant.upsert({
    where: { name: 'Thomas Jeffrey'},
    update: {},
    create: {
        name: 'Thomas Jeffrey',
        teamId: 'BD',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const suki = await prisma.entrant.upsert({
    where: { name: 'Suki Saran'},
    update: {},
    create: {
        name: 'Suki Saran',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const dj = await prisma.entrant.upsert({
    where: { name: 'Duncan Jenner'},
    update: {},
    create: {
        name: 'Duncan Jenner',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const cindy = await prisma.entrant.upsert({
    where: { name: 'Sam Crawford'},
    update: {},
    create: {
        name: 'Sam Crawford',
        teamId: 'BS',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const dish = await prisma.entrant.upsert({
    where: { name: 'David Washer'},
    update: {},
    create: {
        name: 'David Washer',
        teamId: 'BB',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const tony = await prisma.entrant.upsert({
    where: { name: 'Anthony Money'},
    update: {},
    create: {
        name: 'Anthony Money',
        teamId: 'BB',
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const greeney = await prisma.entrant.upsert({
    where: { name: 'Peter Greene'},
    update: {},
    create: {
        name: 'Peter Greene',
        teamId: 'BB',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const salvage = await prisma.entrant.upsert({
    where: { name: 'Paul Salvage'},
    update: {},
    create: {
        name: 'Paul Salvage',
        teamId: 'BB',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const darren = await prisma.entrant.upsert({
    where: { name: 'Darren James Read'},
    update: {},
    create: {
        name: 'Darren James Read',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const john = await prisma.entrant.upsert({
    where: { name: 'John Ashen'},
    update: {},
    create: {
        name: 'John Ashen',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const malc = await prisma.entrant.upsert({
    where: { name: 'Malcolm McLaughlin'},
    update: {},
    create: {
        name: 'Malcolm McLaughlin',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const ben = await prisma.entrant.upsert({
    where: { name: 'Ben Pettet'},
    update: {},
    create: {
        name: 'Ben Pettet',
        teamId: 'EU',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const chris = await prisma.entrant.upsert({
    where: { name: 'Chris Stevens'},
    update: {},
    create: {
        name: 'Chris Stevens',
        teamId: 'RF',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const greg = await prisma.entrant.upsert({
    where: { name: 'Greg Hammond'},
    update: {},
    create: {
        name: 'Greg Hammond',
        teamId: 'RF',
        captain: false,
        compPermission: true,
        financePermission: true,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const chef = await prisma.entrant.upsert({
    where: { name: 'Tony Delaney'},
    update: {},
    create: {
        name: 'Tony Delaney',
        teamId: 'RF',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const justin = await prisma.entrant.upsert({
    where: { name: 'Justin Gledhill-Carr'},
    update: {},
    create: {
        name: 'Justin Gledhill-Carr',
        teamId: 'RF',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const charlie = await prisma.entrant.upsert({
    where: { name: 'Charlie Appleton'},
    update: {},
    create: {
        name: 'Charlie Appleton',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const kev = await prisma.entrant.upsert({
    where: { name: 'Kevin Reid'},
    update: {},
    create: {
        name: 'Kevin Reid',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const malk = await prisma.entrant.upsert({
    where: { name: 'Malkinder Dhami'},
    update: {},
    create: {
        name: 'Malkinder Dhami',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const phil = await prisma.entrant.upsert({
    where: { name: 'Phil Jarrett'},
    update: {},
    create: {
        name: 'Phil Jarrett',
        teamId: 'SH',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const ed = await prisma.entrant.upsert({
    where: { name: 'Edward Money'},
    update: {},
    create: {
        name: 'Edward Money',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const lokesh = await prisma.entrant.upsert({
    where: { name: 'Lokesh Patel'},
    update: {},
    create: {
        name: 'Lokesh Patel',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const jamie = await prisma.entrant.upsert({
    where: { name: 'James Bartlett'},
    update: {},
    create: {
        name: 'James Bartlett',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const kelvin = await prisma.entrant.upsert({
    where: { name: 'Kelvin Munroe'},
    update: {},
    create: {
        name: 'Kelvin Munroe',
        teamId: 'SW',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const linas = await prisma.entrant.upsert({
    where: { name: 'Linas Bumblys'},
    update: {},
    create: {
        name: 'Linas Bumblys',
        teamId: '2B',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const sam = await prisma.entrant.upsert({
    where: { name: 'Sam Ryan'},
    update: {},
    create: {
        name: 'Sam Ryan',
        teamId: '2B',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const anthony = await prisma.entrant.upsert({
    where: { name: 'Anthony Elisak'},
    update: {},
    create: {
        name: 'Anthony Elisak',
        teamId: '2B',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  const dix = await prisma.entrant.upsert({
    where: { name: 'Steve Dixon'},
    update: {},
    create: {
        name: 'Steve Dixon',
        teamId: '2B',
        captain: false,
        transactions: {
            create: {
                amount: 2000,
                description: 'LIB Entry Fee',
                type: 'DR',
                netAmount: -2000,
                createdAt: '2024-03-29T00:00:00.000Z'
            }
        }
    },
  })

  console.log({danny, tom, kyle, terry, cod, robbie,graham,  james, lee, randip, fordey, smithy,
jethro, suki, dj, cindy, dish, tony, greeney, salvage, darren, john, malc, ben, chris,
greg, chef, justin, charlie, kev, malk, phil, ed, lokesh, jamie, kelvin, linas, sam, anthony,
dix
    })

    //Add Comps=========================================================

    const comp1 = await prisma.comp.upsert({
        where: { igCompId: '1742' },
        update: {},
        create: {
            igCompId: '1742',
            shortName: 'MARSTAB',
            name: 'The Race to Le Touquet Stableford',
            date: '2024-03-30T00:00:00.000Z',
            stableford: true,
            open: true,
        }
    })

    const comp2 = await prisma.comp.upsert({
        where: { igCompId: '1676' },
        update: {},
        create: {
            igCompId: '1676',
            shortName: 'OCO',
            name: 'OCO Spring Cup',
            date: '2024-04-07T00:00:00.000Z',
            stableford: true,
        }
    })

    const comp3 = await prisma.comp.upsert({
        where: { igCompId: '1747' },
        update: {},
        create: {
            igCompId: '1747',
            shortName: 'APRMEDAL',
            name: 'April Medal',
            date: '2024-04-14T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp4 = await prisma.comp.upsert({
        where: { igCompId: '1750' },
        update: {},
        create: {
            igCompId: '1750',
            shortName: 'APRSTAB',
            name: 'April Stableford',
            date: '2024-04-21T00:00:00.000Z',
            stableford: true,

        }
    })

    const comp5 = await prisma.comp.upsert({
        where: { igCompId: '1679' },
        update: {},
        create: {
            igCompId: '1679',
            shortName: 'STGEORGE',
            name: "St George's Day Cup",
            date: '2024-04-27T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp6 = await prisma.comp.upsert({
        where: { igCompId: '1753' },
        update: {},
        create: {
            igCompId: '1753',
            shortName: 'MAYMEDAL',
            name: 'May Medal',
            date: '2024-05-05T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp7 = await prisma.comp.upsert({
        where: { igCompId: '1682' },
        update: {},
        create: {
            igCompId: '1682',
            shortName: 'FOUNDATION',
            name: 'Foundation Cup',
            date: '2024-05-12T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp8 = await prisma.comp.upsert({
        where: { igCompId: '1756' },
        update: {},
        create: {
            igCompId: '1756',
            shortName: 'MAYSTAB',
            name: 'May Stableford',
            date: '2024-05-19T00:00:00.000Z',
            stableford: true,

        }
    })

    const comp9 = await prisma.comp.upsert({
        where: { igCompId: '1759' },
        update: {},
        create: {
            igCompId: '1759',
            shortName: 'JUNMEDAL',
            name: 'June Medal',
            date: '2024-06-02T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp10 = await prisma.comp.upsert({
        where: { igCompId: '1688' },
        update: {},
        create: {
            igCompId: '1688',
            shortName: 'WIG',
            name: 'WIG Trophy',
            date: '2024-06-08T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp11 = await prisma.comp.upsert({
        where: { igCompId: '1762' },
        update: {},
        create: {
            igCompId: '1762',
            shortName: 'JUNSTAB',
            name: 'June Stableford',
            date: '2024-06-23T00:00:00.000Z',
            stableford: true,

        }
    })

    const comp12 = await prisma.comp.upsert({
        where: { igCompId: '1691' },
        update: {},
        create: {
            igCompId: '1691',
            shortName: 'FOOTSIE',
            name: 'The Footsie',
            date: '2024-06-30T00:00:00.000Z',
            stableford: true,

        }
    })

    const comp13 = await prisma.comp.upsert({
        where: { igCompId: '1860' },
        update: {},
        create: {
            igCompId: '1860',
            shortName: 'JULMEDAL',
            name: 'July Medal',
            date: '2024-07-14T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp14 = await prisma.comp.upsert({
        where: { igCompId: '1872' },
        update: {},
        create: {
            igCompId: '1872',
            shortName: 'JULSTAB',
            name: 'July Stableford',
            date: '2024-07-21T00:00:00.000Z',
            stableford: true,

        }
    })

    const comp15 = await prisma.comp.upsert({
        where: { igCompId: '1863' },
        update: {},
        create: {
            igCompId: '1863',
            shortName: 'AUGMEDAL',
            name: 'August Medal',
            date: '2024-08-11T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp16 = await prisma.comp.upsert({
        where: { igCompId: '1875' },
        update: {},
        create: {
            igCompId: '1875',
            shortName: 'AUGSTAB',
            name: 'August Stableford',
            date: '2024-08-25T00:00:00.000Z',
            stableford: true,

        }
    })

    const comp17 = await prisma.comp.upsert({
        where: { igCompId: '1657' },
        update: {},
        create: {
            igCompId: '1657',
            shortName: 'CCHAMPS1',
            name: 'Club Championship Rd 1',
            date: '2024-08-31T00:00:00.000Z',
            stableford: false,

        }
    })

    const comp18 = await prisma.comp.upsert({
        where: { igCompId: '1658' },
        update: {},
        create: {
            igCompId: '1658',
            shortName: 'CCHAMPS2',
            name: 'Club Championship Rd 2',
            date: '2024-09-01T00:00:00.000Z',
            stableford: false,

        }
    })



    console.log({comp1, comp2, comp3, comp4, comp5, comp6, comp7, comp8, comp9, comp10, 
        comp11, comp12, comp13, comp14, comp15, comp16, comp17, comp18, })

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