function getWelcome(req, res) {
  return res.json(
    {
      orders: [
        {
          id: 1,
          ordernumber: '4-1',
          place:'江北',
          datetime:'20200315'
        }, {
          id: 2,
          ordernumber: '3-1',
          place:'江北',
          datetime:'20200315'
        }, {
          id: 3,
          ordernumber: '2-1',
          place:'江北',
          datetime:'20200315'
        }
      ],
      demos: [
        {
          id: 1,
          ordernumber: '2-1',
          place:'江北',
          datetime:'20200315'
        }, {
          ordernumber: '2-1',
          place:'江北',
          datetime:'20200315'
        }, {
          ordernumber: '2-1',
          place:'江北',
          datetime:'20200315'
        }
      ],
      problems: [
        {
          id: 1,
          type:'首件',
          description: '这是一条问题描述',
          ordernumber:'2-1',
          datetime:'20200317'
        }, {
          id: 2,
          type:'首件',
          description: '这是一条问题描述',
          ordernumber:'3-1',
          datetime:'20200317'
        }, {
          id: 3,
          type:'首件',
          description: '这是一条问题描述',
          ordernumber:'1-5',
          datetime:'20200317'
        }
      ]
    },
  )
}

function getOrder(req, res) {
  return res.json({
    key: 1,
    place: '江北',
    order: '4-5',
    figure: 'AL2.908.4444',
    figureversion: '1.2',
    roadmap: '4.5',
    problems: [
      {
        key: 1,
        description: '缺装问题多',
        date: '20200319',
        solved: false,
      },
      {
        key: 2,
        description: '时间不够',
        date: '20200320',
        solved: false,
      },
    ],
    status: [
      {
        key: 1,
        event: '配发',
        date: '20200405',
      },
      {
        key: 2,
        event: '确认',
        date: '20200407',
      },
      {
        key: 3,
        event: '领料',
        date: '20200408',
      },
    ],
  });
}

function getOrders(req, res) {
  res.json([
    {
      key: 1,
      place: '江北',
      order: '4-5',
      description: '这是一条简短的描述',
      figure: 'AL2.908.4444',
      figureversion: '1.2',
      roadmap: '4.5',
      progress: 70,
      createtime: '2020-04-23 12:30:21',
    },
    {
      key: 2,
      place: '宏睿',
      order: '4-5',
      description: '这是一条简短的描述',
      figure: 'AL2.908.1111',
      figureversion: '1.1',
      roadmap: '4.5',
      progress: 50,
      createtime: '2020-04-23 12:30:21',
    },
  ])
}

function addOrder(req, res) {
  res.send({
    message: 'Ok',
  });
}

function getCompanies(req, res) {
  return res.json([
    {
      key: 1,
      place: '江北',
      role: '手工',
    },
    {
      key: 2,
      place: '国睿',
      role: '工艺1',
    },
  ]);
}

function getTypes(req, res) {
  return res.json([
    {
      key: 1,
      name: 'SMT',
      people: '赵XX',
    },
    {
      key: 2,
      name: '手工',
      people: '张XX',
    },
  ]);
}

function getDemo(req, res) {
  return res.json({
    key: 1,
    order: '5-1',
    createtime: '20200103',
    problems: [
      {
        description: '缺装问题',
        date: '20200301',
      },
      {
        description: '等待问题',
        date: '20200321',
      },
    ],
  })
}

function getDemos(req, res) {
  return res.json([{
    key: 1,
    order: '5-1',
    createtime: '20200103',
    place:'公司1',
    problem: [
      {
        description: '缺装问题',
        date: '20200301',
      },
      {
        description: '等待问题',
        date: '20200321',
      },
    ],
  }, {
    key: 2,
    order: '4-1',
    createtime: '20200103',
    place:'公司2',
    problem: [
      {
        description: '缺装问题',
        date: '20200301',
      },
      {
        description: '等待问题',
        date: '20200321',
      },
    ],
  },]);
}

function getProblems(req, res) {
  res.json([
    {
      id: 1,
      type:'首件',
      description: '这是一条问题描述',
      datetime: '202004291002',
      orderid:'2-1'
    }, {
      id: 2,
      type:'首件',
      description: '这是一条问题描述2',
      datetime: '20200304010',
      orderid:'3-2'
    },{
      id: 3,
      type:'首件',
      description: '这是一条问题描述3',
      datetime: '20200304010',
      orderid:'3-2'
    },{
      id: 4,
      type:'订单',
      description: '这是一条问题描述3',
      datetime: '20200304010',
      orderid:'3-2'
    }
  ])
}

export default {
  'GET /api/welcome/:userid': getWelcome,
  'GET /api/order/all': getOrders,
  'GET /api/order/:orderid': getOrder,
  'GET /api/demos/user/:usrid': getDemos,
  'GET /api/demo/:demoid': getDemo,
  'GET /api/companies': getCompanies,
  'GET /api/types': getTypes,
  'GET /api/problems/:userid':getProblems,
  'POST /api/order/add': addOrder
};
