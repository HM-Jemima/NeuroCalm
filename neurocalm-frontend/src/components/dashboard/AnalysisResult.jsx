import { motion } from 'framer-motion';
import { getStressLevel } from '../../utils/helpers';
import { STRESS_LEVEL_LIST } from '../../utils/constants';

export default function AnalysisResult({ result }) {
  if (!result) return null;

  const score = result.stress_score ?? result.score ?? 0;
  const confidence = result.confidence ?? 87;
  const stressProb = result.stress_probability ?? (100 - confidence);
  const features = result.features_count ?? 1222;
  const level = getStressLevel(score, result.workload_class);
  const classProbabilities = Array.isArray(result.class_probabilities)
    ? result.class_probabilities
    : [];

  // SVG circle math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stress Ring */}
      <div className="relative">
        <svg width="180" height="180" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="14"
            fill="none"
          />
          {/* Progress ring */}
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            stroke={level.color}
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-display font-bold"
            style={{ color: level.color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-base font-semibold mt-1" style={{ color: level.color }}>
            {level.label}
          </span>
        </div>
      </div>

      {/* Confidence badge */}
      <span className="px-4 py-1.5 bg-bg-glass border border-border-color rounded-full text-xs text-text-secondary font-medium">
        {confidence}% confidence
      </span>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {[
          { value: `${confidence}%`, label: 'Confidence' },
          { value: `${stressProb}%`, label: 'Stress Prob' },
          { value: features.toLocaleString(), label: 'Features' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-lg font-display font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {classProbabilities.length > 0 && (
        <div className="w-full rounded-2xl border border-border-color bg-bg-glass/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Model class probabilities
            </p>
            <span className="text-[11px] text-text-muted">4-class output</span>
          </div>
          <div className="space-y-3">
            {STRESS_LEVEL_LIST.map((classLevel, index) => {
              const probability = Number(classProbabilities[index] ?? 0);
              const percent = probability <= 1 ? probability * 100 : probability;
              const isPredicted = classLevel.classId === Number(result.workload_class);

              return (
                <div key={classLevel.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isPredicted ? classLevel.textClass : 'text-text-secondary'}`}>
                      {classLevel.label}
                    </span>
                    <span className={isPredicted ? classLevel.textClass : 'text-text-muted'}>
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-primary/70">
                    <div
                      className={`h-full rounded-full ${classLevel.ringClass}`}
                      style={{ width: `${Math.max(2, Math.min(percent, 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
