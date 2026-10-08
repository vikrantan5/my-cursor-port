"use client";

import { MobileExperience } from "@/components/mobile/MobileExperience";
import { MobileProjectPage } from "@/components/mobile/MobileProjectPage";
import { Workbench } from "@/components/workbench/Workbench";
import { isProjectFile } from "@/lib/projects";

export function AppShell({ initialFileId }: { initialFileId?: string }) {
  const project = Boolean(initialFileId && isProjectFile(initialFileId));

  return (
    <>
      <div className="hidden h-full md:block">
        <Workbench initialFileId={initialFileId} />
      </div>
      <div className="h-full md:hidden">
        {project && initialFileId ? (
          <MobileProjectPage id={initialFileId} />
        ) : (
          <MobileExperience />
        )}
      </div>
    </>
  );
}
