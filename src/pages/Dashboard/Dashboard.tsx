import { faker } from '@faker-js/faker';
import { useNavigate } from 'react-router-dom';

import { LeaderBoardCard } from '@/components';
import { Button } from '@/components/ui/button';
// import { usePost } from '@/custom/api';
// import { toast } from '@/components/ui/use-toast';

const USERS = [
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 8 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 8 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 8 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 8 }),
  },
  {
    name: faker.internet.userName(),
    score: faker.number.int({ max: 8 }),
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  // const {
  //   mutate: postQuizzMutate,
  //   data: postData,
  //   isSuccess: postQuizzSuccess,
  //   isError: postQuizzIsError,
  //   error: postQuizzError,
  // } = usePost(`post-quiz`);

  // useEffect(() => {
  //   if (postData) {
  //     toast({
  //       title: 'You get the following values:',
  //       description: (
  //         <pre className="mt-2 w-fit rounded-md bg-slate-950 p-4">
  //           <code className="text-white w-full">
  //             {JSON.stringify(postData, null, 2)}
  //           </code>
  //         </pre>
  //       ),
  //     });
  //     // console.log(data);
  //     // navigate(`/dashboard`);
  //   } else if (postQuizzIsError) {
  //     console.error(postQuizzError);
  //   }
  // }, [postQuizzSuccess, postQuizzError, postData]);

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
