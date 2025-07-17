import { Card } from "@/components/ui/card";
import { Waves, Bike, Footprints, Trophy } from "lucide-react";
import { worldRecords } from "@/lib/calculator";
import { useLanguage } from "@/contexts/LanguageContext";

interface CourseSelectionProps {
  selectedCourse: string | null;
  onCourseSelect: (course: string) => void;
}

export default function CourseSelection({ selectedCourse, onCourseSelect }: CourseSelectionProps) {
  const { t } = useLanguage();
  
  const courses = [
    {
      id: 'olympic',
      name: t('olympicCourse'),
      distances: [
        { icon: Waves, label: `${t('swimming')}: 1.5km`, color: 'text-blue-500' },
        { icon: Bike, label: `${t('cycling')}: 40km`, color: 'text-green-500' },
        { icon: Footprints, label: `${t('running')}: 10km`, color: 'text-orange-500' }
      ],
      records: {
        men: '1:40:49',
        women: '1:53:28'
      }
    },
    {
      id: 'ironman',
      name: t('ironmanCourse'),
      distances: [
        { icon: Waves, label: `${t('swimming')}: 3.8km`, color: 'text-blue-500' },
        { icon: Bike, label: `${t('cycling')}: 180km`, color: 'text-green-500' },
        { icon: Footprints, label: `${t('running')}: 42.195km`, color: 'text-orange-500' }
      ],
      records: {
        men: '7:35:39',
        women: '8:18:13'
      }
    }
  ];

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold text-neutral-dark dark:text-foreground mb-4 flex items-center gap-2">
        <Trophy className="text-sports-blue" size={20} />
        {t('courseSelection')}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-colors duration-200 ${
              selectedCourse === course.id
                ? 'border-sports-blue bg-blue-50'
                : 'border-gray-200 hover:border-sports-blue'
            }`}
            onClick={() => onCourseSelect(course.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-neutral-dark">{course.name}</h3>
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedCourse === course.id
                  ? 'bg-sports-blue border-sports-blue'
                  : 'border-gray-300'
              }`} />
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {course.distances.map((distance, index) => (
                <div key={index} className="flex items-center gap-2">
                  <distance.icon className={`${distance.color} w-4 h-4`} />
                  <span>{distance.label}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-1">세계기록</div>
              <div className="text-sm font-medium text-neutral-dark">
                <span className="text-blue-600">남자: {course.records.men}</span> | {' '}
                <span className="text-pink-600">여자: {course.records.women}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
