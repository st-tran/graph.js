const diseaseAdjacencyList = {
    a: [{ b: [1], d: [6], e: [2], f: [3] }],
    b: [{ c: [7], e: [5], f: [1] }],
    c: [{ e: [9] }],
    d: [{ f: [2] }],
    g: [{ b: [6] }],
};

const treeAdjacencyList = {
    a: [{ b: [6, 50, 20], c: [3, 150, 20] }, 100, 10],
    b: [{ d: [3, 30, 50], e: [20, 70, 50] }],
    c: [{ f: [4, 130, 50], g: [20, 170, 50] }],
    d: [{ h: [10, 20, 70], i: [1, 40, 70] }],
    g: [{ j: [1, 190, 80] }],
    j: [{ k: [3, 220, 100] }],
};

const mstExample = {
    a: [{ b: [3, 50, 130], d: [6, 60, 70], e: [9, 200, 200] }, 20, 150],
    b: [{ c: [2, 80, 100], d: [4, 60, 70], e: [9, 200, 200], f: [9, 210, 150] }],
    c: [{ d: [2, 60, 70], g: [9, 210, 20], f: [8, 210, 150] }],
    d: [{ g: [9, 210, 20] }],
    e: [{ f: [8, 210, 150], j: [18, 300, 50] }],
    f: [{ g: [7, 210, 20], i: [9, 260, 50], j: [10, 300, 50] }],
    g: [{ h: [4, 260, 20], i: [5, 260, 50] }],
    h: [{ i: [1, 260, 50], j: [13, 300, 50] }],
    i: [{ j: [3, 300, 50] }],
};

const randomlyPlacedGraph = {
    a: [{ b: [1] }],
    b: [{ c: [1] }],
    c: [{ d: [1] }],
    d: [{ e: [1] }],
    e: [{ f: [1] }],
    f: [{ g: [1] }],
    g: [{ h: [1] }],
    h: [{ i: [1] }],
    i: [{ j: [1] }],
    j: [{ k: [1] }],
    k: [{ l: [1] }],
    l: [{ m: [1] }],
    m: [{ n: [1] }],
    n: [{ o: [1] }],
    o: [{ p: [1] }],
    p: [{ q: [1] }],
    q: [{ r: [1] }],
    r: [{ s: [1] }],
    s: [{ t: [1] }],
    t: [{ u: [1] }],
    u: [{ v: [1] }],
    v: [{ w: [1] }],
    w: [{ x: [1] }],
    x: [{ y: [1] }],
    y: [{ aa: [1] }],
    aa: [{ bb: [1] }],
    bb: [{ cc: [1] }],
    cc: [{ dd: [1] }],
    dd: [{ ee: [1] }],
    ee: [{ ff: [1] }],
    ff: [{ gg: [1] }],
    gg: [{ hh: [1] }],
    hh: [{ ii: [1] }],
    ii: [{ jj: [1] }],
    jj: [{ kk: [1] }],
    kk: [{ ll: [1] }],
    ll: [{ mm: [1] }],
    mm: [{ nn: [1] }],
    nn: [{ oo: [1] }],
    oo: [{ pp: [1] }],
    pp: [{ qq: [1] }],
    qq: [{ rr: [1] }],
    rr: [{ ss: [1] }],
    ss: [{ tt: [1] }],
    tt: [{ uu: [1] }],
    uu: [{ vv: [1] }],
    vv: [{ ww: [1] }],
    ww: [{ xx: [1] }],
    xx: [{ yy: [1] }],
    yy: [{ z: [1] }],
};
