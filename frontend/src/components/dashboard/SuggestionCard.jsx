import { Card, CardContent } from "@/components/ui/card";

function SuggestionCard() {
  return (
    <Card className="rounded-3xl shadow-xl border-0">

      <CardContent className="p-8">

        <h2 className="text-3xl font-bold mb-6">

          AI Suggestions

        </h2>

        <ul className="space-y-4">

          <li>✔ Add Docker projects.</li>

          <li>✔ Mention measurable achievements.</li>

          <li>✔ Improve project descriptions.</li>

          <li>✔ Learn AWS fundamentals.</li>

        </ul>

      </CardContent>

    </Card>
  );
}

export default SuggestionCard;