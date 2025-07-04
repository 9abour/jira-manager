import { useLang } from '@hooks/useLang';
import type { JiraIssue } from 'core/types/jira.types';
import type { RootState } from 'infrastructure/rtk/store/store';
import { AlarmClockPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { setTimelineSearchResults } from 'infrastructure/rtk/slices/filtersReducer';
import { useTimelineIssuesLoader } from '~/pages/hooks/useTimelineIssuesLoader';
import useAssignedJiraIssues from '@hooks/useAssignedJiraIssues';
import TimelinePagination from 'features/home/TimelinePagination';
import {
  setIsModalOpen,
  setIssueToLogWork,
} from 'infrastructure/rtk/slices/logWorkReducer';

const StoryCard = ({ issue }: { issue: JiraIssue }) => {
  const dispatch = useDispatch();

  return (
    <motion.button
      whileHover={{
        scale: 1.04,
        boxShadow: '0 4px 24px rgba(80,180,255,0.15)',
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="w-full h-[150px] flex flex-col justify-between bg-white shadow-sm border border-gray-light rounded-md hover:shadow-md p-2 backdrop-blur-md"
      style={{ background: 'rgba(255,255,255,0.85)' }}
      onClick={() => {
        dispatch(setIsModalOpen(true));
        dispatch(setIssueToLogWork(issue));
      }}
    >
      <h3 className="text-start font-semibold text-primary-darkTitle text-lg line-clamp-3">
        {issue.fields.summary}
      </h3>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-1">
          <img
            src={issue.fields.assignee.avatarUrls['16x16']}
            className="w-[16px] h-[16px]"
          />

          <p className="text-gray-600 text-[12px] line-clamp-2 font-medium">
            {issue.fields.assignee.displayName}
          </p>
        </div>

        <button className="text-primary hover:text-primary/80 hover:scale-105">
          <AlarmClockPlus strokeWidth={3} size={20} />
        </button>
      </div>
    </motion.button>
  );
};

const IssuesTimelineView = () => {
  const { fetchIssues } = useAssignedJiraIssues(['Task', 'Story', 'Bug']);

  const { t } = useLang();

  const { done, inProgress, toDo, isLoading } = useSelector(
    (state: RootState) => state.issuesByStats
  );
  const { searchValue, timelineSearchResults } = useSelector(
    (state: RootState) => state.filters
  );

  useTimelineIssuesLoader({
    fetchIssues,
    done: done,
    inProgress: inProgress,
    toDo: toDo,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (searchValue !== '') {
      const searchedToDo = toDo.filter((issue) => {
        return issue.fields.summary
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });

      const searchedInProgress = inProgress.filter((issue) => {
        return issue.fields.summary
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });

      const searchedDone = done.filter((issue) => {
        return issue.fields.summary
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });

      dispatch(
        setTimelineSearchResults({
          toDo: searchedToDo,
          inProgress: searchedInProgress,
          done: searchedDone,
        })
      );
    }
  }, [searchValue]);

  const displayedTodo = useMemo(() => {
    return timelineSearchResults.toDo && timelineSearchResults.toDo?.length > 0
      ? timelineSearchResults.toDo
      : toDo;
  }, [timelineSearchResults.toDo, searchValue, toDo]);

  const displayedInProgress = useMemo(() => {
    return timelineSearchResults.inProgress &&
      timelineSearchResults.inProgress?.length > 0
      ? timelineSearchResults.inProgress
      : inProgress;
  }, [timelineSearchResults, searchValue, inProgress]);

  const displayedDone = useMemo(() => {
    return timelineSearchResults.done && timelineSearchResults.done?.length > 0
      ? timelineSearchResults.done
      : done;
  }, [timelineSearchResults, searchValue, done]);

  const columnVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        type: 'spring' as const,
        stiffness: 120,
        damping: 18,
      },
    }),
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* To Do Issues */}
        <motion.div
          custom={0}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-fit bg-gradient-to-br from-yellow-200 via-yellow-50 to-orange-100 border-t-8 rounded-lg border-[#fe9f0a] p-4 animate-gradient-x"
          style={{
            background: 'linear-gradient(120deg, #fffbe6 0%, #ffe0b2 100%)',
          }}
        >
          <h3 className="font-semibold text-primary-darkTitle text-xl mb-4">
            {t.common.toDo}
          </h3>

          {displayedTodo?.length ? (
            <div className="flex flex-col gap-4">
              {displayedTodo?.map((issue) => (
                <StoryCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-600 font-medium">
                {isLoading ? t.common.loading : t.common.noIssues}
              </p>
            </div>
          )}
        </motion.div>

        {/* In Progress Issues */}
        <motion.div
          custom={1}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-fit bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-100 border-t-8 rounded-lg border-[#0b84ff] p-4 animate-gradient-x"
          style={{
            background: 'linear-gradient(120deg, #e3f0ff 0%, #f0faff 100%)',
          }}
        >
          <h3 className="font-semibold text-primary-darkTitle text-xl mb-4">
            {t.common.inProgress}
          </h3>

          {displayedInProgress.length ? (
            <div className="flex flex-col gap-4">
              {displayedInProgress.map((issue) => (
                <StoryCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-600 font-medium">
                {isLoading ? t.common.loading : t.common.noIssues}
              </p>
            </div>
          )}
        </motion.div>

        {/* Done */}
        <motion.div
          custom={2}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
          className="w-full h-fit bg-gradient-to-br from-green-100 via-green-50 to-lime-100 border-t-8 rounded-lg border-[#31d648] p-4 animate-gradient-x"
          style={{
            background: 'linear-gradient(120deg, #e6ffe6 0%, #eaffea 100%)',
          }}
        >
          <h3 className="font-semibold text-primary-darkTitle text-xl mb-4">
            {t.common.done}
          </h3>

          {displayedDone.length ? (
            <div className="flex flex-col gap-4">
              {displayedDone.map((issue) => (
                <StoryCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-600 font-medium">
                {isLoading ? t.common.loading : t.common.noIssues}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <TimelinePagination />
    </>
  );
};

export default IssuesTimelineView;
