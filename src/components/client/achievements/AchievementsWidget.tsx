
import { Award, Star, Trophy, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/types/token";

interface AchievementsWidgetProps {
  achievements: Achievement[];
}

const AchievementsWidget = ({ achievements }: AchievementsWidgetProps) => {
  const completedAchievements = achievements.filter(a => a.completed);
  const completionPercentage = Math.round((completedAchievements.length / achievements.length) * 100);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Achievements</CardTitle>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>{completedAchievements.length}/{achievements.length} Unlocked</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {completionPercentage}% Complete
          </p>
        </div>
        
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`flex items-center p-3 rounded-md transition-colors ${
                achievement.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-full mr-3 ${
                achievement.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {achievement.icon === 'star' && <Star className="h-4 w-4" />}
                {achievement.icon === 'award' && <Award className="h-4 w-4" />}
                {achievement.icon === 'trophy' && <Trophy className="h-4 w-4" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{achievement.name}</h4>
                  {achievement.reward && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {achievement.reward} tokens
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{achievement.description}</p>
                
                {achievement.progress && !achievement.completed && (
                  <div className="mt-1.5">
                    <Progress 
                      value={(achievement.progress.current / achievement.progress.target) * 100} 
                      className="h-1.5" 
                    />
                    <p className="text-xs text-right mt-0.5 text-gray-500">
                      {achievement.progress.current}/{achievement.progress.target}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsWidget;
