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
  res.json([
    {
      id: 0,
      name: 'Kapitolyo',
      info: 'The seat of power',
      issues: [2, 2, 1, 0, 0]
    },
    {
      id: 1,
      name: 'Casino',
      info: 'Wealthy and crimey',
      issues: [0, 3, 2, 0, 0]
    },
    {
      id: 2,
      name: 'Fishing Village',
      info: 'Rural poor',
      issues: [0, 1, 4, 0, 0]
    },
    {
      id: 3,
      name: 'Port',
      info: 'Urban poor',
      issues: [0, 2, 3, 1, 0]
    },
    {
      id: 4,
      name: 'Cathedral',
      info: 'People love God. God be the glory.',
      issues: [0, 1, 0, 0, 4]
    },
    {
      id: 5,
      name: 'Resort',
      info: 'Environmentalism and tourism',
      issues: [0, 0, 2, 3, 0]
    }
  ]);
}

exports.kapitans = function(req, res){
  res.json([
    {
      id: 0,
      name: 'Owlberto',
      image: 'owlberto.png'
    },
    {
      id: 1,
      name: 'Catorcio',
      image: 'catorcio.png'
    },
    {
      id: 2,
      name: 'Pelicarpio',
      image: 'pelicarpio.png'
    },
    {
      id: 3,
      name: 'Tortuga',
      image: 'tortuga.png'
    },
    {
      id: 4,
      name: 'Father Doglas',
      image: 'doglas.png'
    },
    {
      id: 5,
      name: 'Alpacano',
      image: 'alpaca.png'
    }
    ]);
}
