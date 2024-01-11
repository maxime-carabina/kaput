interface LeaderBoardCardProps {
  name: string;
  score: number;
}

export function LeaderBoardCard(props: LeaderBoardCardProps) {
  const { name, score } = props;

  return (
    <div className="flex justify-between items-center w-full">
      <p className="kp-body text-primary">{name}</p>
      <p className="kp-body text-primary">{score}</p>
    </div>
  );
}
