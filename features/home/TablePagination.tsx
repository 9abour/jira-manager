import {
  decreasePage,
  increasePage,
} from 'infrastructure/rtk/slices/issuesByTypeReducer';
import type { RootState } from 'infrastructure/rtk/store/store';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const items = [
  {
    id: 1,
    title: 'Back End Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
  },
  {
    id: 2,
    title: 'Front End Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
  },
  {
    id: 3,
    title: 'User Interface Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'Remote',
  },
];

export default function TablePagination() {
  const { total, issues, startAt, maxResults, page } = useSelector(
    (state: RootState) => state.issuesByType
  );
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between border-gray-200 bg-white px-0 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => {
            dispatch(decreasePage());
          }}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => {
            dispatch(increasePage());
          }}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{page}</span> to{' '}
            <span className="font-medium">
              {Math.floor(total / maxResults)}
            </span>{' '}
            of <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
          >
            <button
              onClick={() => {
                dispatch(decreasePage());
              }}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </button>
            <a
              className={`relative z-10 inline-flex items-center bg-primary text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary   px-4 py-2 text-sm font-semibold`}
            >
              {page}
            </a>

            <button
              onClick={() => {
                dispatch(increasePage());
              }}
              disabled={page === Math.floor(total / maxResults)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
