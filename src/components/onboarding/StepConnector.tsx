
interface StepConnectorProps {
  isCompleted: boolean;
}

export const StepConnector = ({ isCompleted }: StepConnectorProps) => {
  return (
    <div 
      className={`flex-1 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'} transition-all duration-300`}
    />
  );
};
