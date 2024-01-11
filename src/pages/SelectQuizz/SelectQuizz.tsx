import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const QUIZZ = [
  {
    name: 'Quizz 1',
  },
  {
    name: 'Quizz 2',
  },
  {
    name: 'Quizz 3',
  },
  {
    name: 'Quizz 4',
  },
  {
    name: 'Quizz 5',
  },
];

export function SelectQuizz() {
  return (
    <div
      className={`p-10 max-w-5xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-primary`}
    >
      <div className="grid grid-cols-4 justify-items-center gap-6">
        {QUIZZ.map((quizz, index) => (
          <Card key={index} className="w-48">
            <CardHeader>
              <CardTitle className="kp-body">{quizz.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">Play</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
