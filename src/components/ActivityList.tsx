type Activity = {
  id: string;
  message: string;
  createdAt: Date;
};

type ActivityListProps = {
  activities: Activity[];
};

export default function ActivityList({
  activities,
}: ActivityListProps) {
  return (
    <div className="mt-10">
      <h2 className="mb-4 text-2xl font-bold">
        Recent Activity
      </h2>

      {activities.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-gray-500">
            No activity yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border p-4"
            >
              <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />

              <div>
                <p className="text-sm font-medium">
                  {activity.message}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {activity.createdAt.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}