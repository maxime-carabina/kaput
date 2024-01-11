import { faker } from '@faker-js/faker';
import { useNavigate } from 'react-router-dom';

import { LeaderBoardCard } from '@/components';
import { Button } from '@/components/ui/button';

const USERS = [
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 1000 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 1000 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 1000 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 1000 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 1000 }),
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`p-10 max-w-xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-primary`}
      >
        <h1 className="mb-8 kp-banner text-center">Leaderboard</h1>
        <div className="flex flex-col gap-6">
          {USERS.map((user, index) => (
            <LeaderBoardCard key={index} {...user} />
          ))}
        </div>
      </div>
      <div
        className={`p-10 max-w-xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-primary
            flex justify-center items-center gap-4`}
      >
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('create-quizz')}
        >
          Create your Quizz
        </Button>
        <Button className="w-full" onClick={() => navigate('select-quizz')}>
          Select a Quizz
        </Button>
      </div>
    </>
  );
}
