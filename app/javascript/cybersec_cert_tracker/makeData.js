import namor from "namor";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  //const statusChance = Math.random();
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    canvas_id: Math.floor(Math.random() * 100),
    title: namor.generate({ words: 2, numbers: 0 }),
    email_id: namor.generate({ words: 2, numbers: 3}),
    company_id: Math.floor(Math.random() * 100),
    course_progress: namor.generate({ words: 1, numbers: 0 }),
    // status:
    //   statusChance > 0.66
    //     ? "relationship"
    //     : statusChance > 0.33
    //     ? "complicated"
    //     : "single",
  };
};

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
