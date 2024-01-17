import File from '@/../threejs/public/quiz.json';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const QUIZZ = [
  {
    name: 'Quizz 1',
  },
];

export function SelectQuizz() {
  return (
    <div
      className={`p-10 max-w-5xl w-1/2 border border-tertiary rounded-2xl
            bg-secondary/50 backdrop-blur-lg text-primary`}
    >
      <div className="flex items-center gap-6">
        {QUIZZ.map((quizz, index) => (
          <Card key={index} className="w-52">
            <CardHeader>
              <CardTitle className="kp-body">{quizz.name}</CardTitle>
              <CardDescription className="kp-body">
                Number of questions: {Object.keys(File).length}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => window.open('http://localhost:5173/', '_blank')}
              >
                Play
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
