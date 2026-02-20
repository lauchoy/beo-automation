import BEOList from '@/components/BEOList';
import RecipeLibrary from '@/components/RecipeLibrary';
import WorkflowManager from '@/components/WorkflowManager';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          BEO Automation Platform
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Streamline your banquet event orders with integrated recipe management
          and automated workflows powered by Airtable and Doppler.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-blue-600">12</div>
          <div className="text-sm text-gray-600 mt-1">Active BEOs</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-green-600">247</div>
          <div className="text-sm text-gray-600 mt-1">Recipes Available</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-3xl font-bold text-purple-600">8</div>
          <div className="text-sm text-gray-600 mt-1">Active Workflows</div>
        </div>
      </div>

      {/* Recent BEOs */}
      <section>
        <BEOList />
      </section>

      {/* Recipe Library Preview */}
      <section>
        <RecipeLibrary />
      </section>

      {/* Active Workflows */}
      <section>
        <WorkflowManager />
      </section>
    </div>
  );
}
