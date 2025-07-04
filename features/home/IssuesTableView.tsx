import { useLang } from '@hooks/useLang';
import type { JiraIssue } from 'core/types/jira.types';
import type { RootState } from 'infrastructure/rtk/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@utils/cn';
import { setSearchResults } from 'infrastructure/rtk/slices/filtersReducer';
import TablePagination from 'features/home/TablePagination';
import { useTableIssuesLoader } from '~/pages/hooks/useTableIssuesLoader';
import { setLoading } from 'infrastructure/rtk/slices/issuesByTypeReducer';

const IssuesTableView = () => {
  useTableIssuesLoader();

  const { t } = useLang();
  const { issues, isLoading } = useSelector(
    (state: RootState) => state.issuesByType
  );

  const [sortedIssues, setSortedIssues] = useState<JiraIssue[]>([]);
  const [activeSort, setActiveSort] = useState<string>('');

  const { searchValue, searchResults } = useSelector(
    (state: RootState) => state.filters
  );

  const dispatch = useDispatch();
  const handleSort = (
    field:
      | 'key'
      | 'summary'
      | 'type'
      | 'status'
      | 'assignee'
      | 'priority'
      | 'createdDate'
      | 'updatedDate'
  ) => {
    setActiveSort(field === activeSort ? '' : field);

    if (field === activeSort) {
      setSortedIssues(issues);
      return;
    }

    switch (field) {
      case 'key':
        setSortedIssues([...issues].sort((a, b) => a.key.localeCompare(b.key)));
        break;
      case 'summary':
        setSortedIssues(
          [...issues].sort((a, b) =>
            a.fields.summary.localeCompare(b.fields.summary)
          )
        );
        break;
      case 'type':
        setSortedIssues(
          [...issues].sort((a, b) =>
            a.fields.issuetype.name.localeCompare(b.fields.issuetype.name)
          )
        );
        break;
      case 'status':
        setSortedIssues(
          [...issues].sort((a, b) =>
            a.fields.status.name.localeCompare(b.fields.status.name)
          )
        );
        break;
      case 'assignee':
        setSortedIssues(
          [...issues].sort((a, b) =>
            a.fields.assignee.displayName.localeCompare(
              b.fields.assignee.displayName
            )
          )
        );
        break;
      case 'createdDate':
        setSortedIssues(
          [...issues].sort(
            (a, b) =>
              new Date(a.fields.created).getTime() -
              new Date(b.fields.created).getTime()
          )
        );
        break;
      case 'updatedDate':
        setSortedIssues(
          [...issues].sort(
            (a, b) =>
              new Date(a.fields.updated).getTime() -
              new Date(b.fields.updated).getTime()
          )
        );
        break;
      default:
        setSortedIssues([]);
        break;
    }
  };

  useEffect(() => {
    if (searchValue !== '') {
      dispatch(setLoading(true));
      const searchedIssues = issues.filter((issue) => {
        return (
          issue.fields.summary
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          issue.key.toLowerCase().includes(searchValue.toLowerCase())
        );
      });

      setTimeout(() => {
        dispatch(setSearchResults(searchedIssues));
        dispatch(setLoading(false));
      }, 500); // 500ms delay for demonstration
    }
  }, [searchValue]);

  const displayedIssues = useMemo(() => {
    if (searchValue && searchResults.length > 0) {
      return searchResults;
    } else if (sortedIssues.length > 0) {
      return sortedIssues;
    } else {
      return issues;
    }
  }, [searchValue, searchResults, sortedIssues, issues]);

  return (
    <>
      <motion.div
        className="overflow-x-auto relative p-1"
        style={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
          minHeight: '100%',
          borderRadius: '6px',
          boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.08)',
          overflow: 'hidden',
        }}
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <table className="min-w-full divide-y divide-gray-200 bg-white/80 backdrop-blur-md rounded-[6px] overflow-hidden">
          <thead className="bg-gray-50/80 rounded-[6px] overflow-hidden">
            <tr className="rounded-[6px] overflow-hidden [&>th]:cursor-pointer">
              <th
                onClick={() => handleSort('key')}
                className={cn(
                  'px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-[6px] overflow-hidden'
                )}
              >
                Key {activeSort === 'key' ? '▲' : '▼'}
              </th>
              <th
                onClick={() => handleSort('summary')}
                className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Summary {activeSort === 'summary' ? '▲' : '▼'}
              </th>
              <th
                onClick={() => handleSort('type')}
                className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type {activeSort === 'type' ? '▲' : '▼'}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status {activeSort === 'status' ? '▲' : '▼'}
              </th>
              <th
                onClick={() => handleSort('assignee')}
                className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assignee {activeSort === 'assignee' ? '▲' : '▼'}
              </th>
              <th
                onClick={() => handleSort('createdDate')}
                className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created {activeSort === 'createdDate' ? '▲' : '▼'}
              </th>
              <th
                onClick={() => handleSort('updatedDate')}
                className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-[6px] overflow-hidden"
              >
                Updated {activeSort === 'updatedDate' ? '▲' : '▼'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/80 divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-500 font-medium"
                >
                  {t.common.loading}
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {searchValue && !searchResults.length ? (
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-500 font-medium"
                  >
                    {t.common.noIssues}
                  </td>
                ) : (
                  displayedIssues.map((issue: JiraIssue, idx: number) => (
                    <motion.tr
                      key={issue.id}
                      className="hover:bg-gradient-to-r hover:from-fuchsia-100 hover:to-indigo-100 transition relative group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        delay: idx * 0.05,
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 60,
                      }}
                      style={{ position: 'relative' }}
                    >
                      <td className="px-4 py-4 font-mono text-blue-700">
                        <button>{issue.key}</button>
                      </td>
                      <td
                        className="px-4 py-4 max-w-xs truncate"
                        title={issue.fields.summary}
                      >
                        {issue.fields.summary}
                      </td>
                      <td className="px-4 py-4 flex items-center gap-2">
                        {issue.fields.issuetype.iconUrl && (
                          <img
                            src={issue.fields.issuetype.iconUrl}
                            alt={issue.fields.issuetype.name}
                            className="w-5 h-5 inline-block"
                          />
                        )}
                        <span>{issue.fields.issuetype.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700">
                          {issue.fields.status.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 flex items-center gap-2">
                        {issue.fields.assignee?.avatarUrls?.['16x16'] && (
                          <img
                            src={issue.fields.assignee.avatarUrls['16x16']}
                            alt={issue.fields.assignee.displayName}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span>{issue.fields.assignee?.displayName || '-'}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(issue.fields.created).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(issue.fields.updated).toLocaleDateString()}
                      </td>
                      <motion.td
                        className="absolute inset-0 pointer-events-none rounded-lg opacity-0 group-hover:opacity-60 rounded-[6px]"
                        style={{
                          background:
                            'linear-gradient(90deg, #f0abfc33 0%, #818cf833 100%)',
                          zIndex: 0,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 0.6 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </motion.div>
      <TablePagination />
    </>
  );
};

export default IssuesTableView;
