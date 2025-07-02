import JiraIntegration from 'features/connect/jira/JiraIntegration';
import type { FunctionComponent } from 'react';

interface IndexProps {}

const Index: FunctionComponent<IndexProps> = () => {
  return (
    <main className="relative w-screen h-screen bg-black flex justify-center items-center">
      <div className="w-full">
        <JiraIntegration />
      </div>

      <video
        src="/Animation - 1751485235196.webm"
        autoPlay
        loop
        muted
        className="absolute w-screen h-screen top-0 left-0 blur-lg opacity-[8%] object-cover"
      />
    </main>
  );
};

export default Index;
