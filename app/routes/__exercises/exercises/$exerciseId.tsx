import { format, parseISO } from "date-fns";
import { json, useLoaderData } from "remix";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }) {
  let userId = await requireUserId(request);

  let entries = await prisma.entry.findMany({
    where: { userId, exerciseId: params.exerciseId },
    include: {
      exercise: true,
      sets: true,
    },
  });

  return json({ entries });
}

export default function ExercisePage() {
  let { entries } = useLoaderData();

  return (
    <div className="mt-4">
      {entries.length > 0 ? (
        <div className="divide-y">
          {entries.map((entry) => (
            <div key={entry.id} className="py-4">
              <p className="font-medium">
                {format(parseISO(entry.date), "EEEE, MMMM do")}
              </p>

              <div className="mt-2">
                {entry.sets.map((set) => (
                  <div key={set.id}>
                    <p>
                      {set.weight} lbs – {set.reps} reps
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-sm italic text-gray-700">{entry.notes}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No entries.</p>
      )}
    </div>
  );
}
