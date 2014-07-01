'use strict';

/**
 * Get awesome things
 */
exports.issues = function(req, res) {
  res.json([
    {
      id: 0,
      name : 'Education',
      info : 'Education Programs Description',
      level: 0
    }, {
      id: 1,
      name : 'Law & Order',
      info : 'Police and stuff.',
      level: 0
    }, {
      id: 2,
      name : 'Employment',
      info : 'Jobs and small enterprise',
      level: 0
    }, {
      id: 3,
      name : 'Health',
      info : 'Healthy people are happy people',
      level: 0
    }, {
      id: 4,
      name: 'Religion',
      info: 'God above all things',
      level: 0
    }
  ]);
};

exports.districts = function(req, res){
  //https://docs.google.com/spreadsheets/d/1EazLnhNOdOmIbKBKVb6AS4V4gu6d32pxYl2HxuhfL5Y/pubhtml
  res.json([
    {
      id: 0,
      name: 'Kapitolyo',
      info: 'The seat of power',
      issues: [2, 2, 1, 0, 0],
      kapitanId: 0,
      population: 2000,
      gold: 100
    },
    {
      id: 1,
      name: 'Casino',
      info: 'Wealthy and crimey',
      issues: [0, 3, 2, 0, 0],
      kapitanId: 1,
      population: 1000,
      gold: 50
    },
    {
      id: 2,
      name: 'Fishing Village',
      info: 'Rural poor',
      issues: [0, 1, 4, 0, 0],
      kapitanId: 2,
      population: 1000,
      gold: 50
    },
    {
      id: 3,
      name: 'Port',
      info: 'Urban poor',
      issues: [0, 2, 3, 1, 0],
      kapitanId: 3,
      population: 1000,
      gold: 25
    },
    {
      id: 4,
      name: 'Cathedral',
      info: 'People love God. God be the glory.',
      issues: [0, 1, 0, 0, 4],
      kapitanId: 4,
      population: 3000,
      gold: 25
    },
    {
      id: 5,
      name: 'Resort',
      info: 'Environmentalism and tourism',
      issues: [0, 0, 2, 3, 0],
      kapitanId: 5,
      population: 500,
      gold: 10
    }
  ]);
};

exports.kapitans = function(req, res){
  res.json([
    {
      id: 0,
      name: 'Owlberto',
      image: 'owlberto.png',
      description: 'A professor at the main university, the owl represents the educated class who believe they know what\'s best for the island, while being out of touch with the realities of the less fortunate population.',
      likes: [1,2],
      hates: [2]
    },
    {
      id: 1,
      name: 'Catorcio',
      image: 'catorcio.png',
      description: 'A reformed thug who has worked his way into respectability as a Kapitan.  He\'s not shy about using his underworld connections to advance his interests.',
      likes: [2],
      hates: [0]
    },
    {
      id: 2,
      name: 'Pelicarpio',
      image: 'pelicarpio.png',
      description: 'The representative of the fishing village in the south of summer island. Mad because other islands are encroaching on their fishing grounds, and wants coastal security to be beefed up.',
      likes: [3,4],
      hates: [3]
    },
    {
      id: 3,
      name: 'Victortle',
      image: 'tortuga.png',
      description: 'The head of a stevedore\'s union, is in constant conflict with Boo Tee Kee over workers\' rights,  As a tortoise, he has lived for many years (ie he should look a bit old)',
      likes: [4],
      hates: [1]
    },
    {
      id: 4,
      name: 'Father Doglas',
      image: 'doglas.png',
      description: 'A priest who exerts great power in the main diocese of the capital. He is very close to the family of Crocopio Cortez. He is a fat old priest. very close to big business who makle big donations to the cathedral.',
      likes: [2],
      hates: [5]
    },
    {
      id: 5,
      name: 'Alpacita',
      image: 'alpaca.png',
      description: 'A surfer /environmentalist that fights to keep her resort safe from big business.  Dislikes politicians, CEOs, religion, and anything that isn\'t hip and one with nature.',
      likes: [3],
      hates: [4]
    }
    ]);
};

exports.activities = function(req, res){
  //types of activities: 'TALK', 'SORTIE', 'MOVE', 'STAT'
  res.json([
    {
      id: 0,
      name: 'Photo Op',
      cost: {
        gold: 100,
        hours: 2
      },
      effect: {
        attr: 'reputation',
        modifier: 2
      }
    },
    {
      id: 1,
      name: 'Sortie',
      type: 'SORTIE',
      cost: {
        gold: 500,
        hours: 5
      },
      effect: {
        attr: 'reputation',
        modifier: 6
      }
    },
    {
      id: 2,
      name: 'Put up posters',
      cost: {
        gold: 200,
        hours: 2
      },
      effect: {
        attr: 'reputation',
        modifier: 2
      }
    },
    {
      id: 3,
      name: 'Talk to Kapitan',
      type: 'TALK',
      cost: {
        gold: 0,
        hours: 2
      }
    },
    {
      id: 4,
      name: 'Contest',
      type: 'STAT',
      cost: {
        gold: 200,
        hours: 3
      }
    },
    {
      id: 5,
      name: 'Smear',
      type: 'STAT',
      cost: {
        gold: 200,
        hours: 3
      }
    },
    {
      id: 6,
      name: 'Bribe',
      cost: {
        gold: 1000,
        hours: 3
      }
    }
    ]);
};
