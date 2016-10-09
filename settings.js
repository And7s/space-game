//Settings

var Settings = [
	{
		name: 'start',
		thumbheight: 86,
		bars: [
			{type: 0, pos: new Vector(87,305), width: 172, height: 15, store: 0},
			{type: 1, pos: new Vector(122,644), width: 116, height: 15, store: 2}
		],
		deliver: 2,
		player: {
			gravity: 0.00025,
			accel: 0.001,
			spawnpos: new Vector(150, 170),
			reduce: 0.99,
			maxlife: 100,
			maxfuel: 100,
		},
		map: {
			radius: 25,
			path: 'gfx/map.png'
		},
		guns: [
			{pos: new Vector(535,120), rotate: Math.PI},
			{pos: new Vector(575,120), rotate: Math.PI}
		],
	}, {
		name: 'Sea',
		thumbheight: 56,
		bars: [
			{type: 0, pos: new Vector(495,215), width: 72, height: 15, store: 0},
			{type: 1, pos: new Vector(720,470), width: 72, height: 15, store: 1},
			{type: 1, pos: new Vector(145,489), width: 122, height: 15, store: 1},
			{type: 2, pos: new Vector(599,258), width: 56, height: 15, store: 0}
		],
		deliver: 2,
		player: {
			gravity: 0.0002,
			accel: 0.001,
			spawnpos: new Vector(535, 180),
			reduce: 0.99,
			maxlife: 100,
			maxfuel: 100
		},
		map: {
			radius: 20,
			path: 'gfx/map_sea.png'
		},
		guns: [
			{pos: new Vector(29+18,325), rotate: Math.PI/2},
			{pos: new Vector(31+18,353), rotate: Math.PI/2}
		],
	}, {
		name: 'Leaves',
		thumbheight: 80,
		deliver: 2,
		player: {
			gravity: 0.0005,
			accel: 0.0015,
			spawnpos: new Vector(385, 419),
			reduce: 0.99,
			maxlife: 100,
			maxfuel: 100
		},
		map: {
			radius: 13,
			path: 'gfx/map_leaves.png'
		},
		guns: [
			{pos: new Vector(241,663+14), rotate: 0},
			{pos: new Vector(401+10,136-10), rotate: 1.333*Math.PI},
			{pos: new Vector(790+10,382), rotate: 1.611*Math.PI}
		],
		bars: [
			{type: 0, pos: new Vector(350,493), width: 65, height: 15, store: 0},
			{type: 1, pos: new Vector(530,607), width: 88, height: 15, store: 1},
			{type: 1, pos: new Vector(627,493), width: 102, height: 15, store: 1}

		],
	}
]