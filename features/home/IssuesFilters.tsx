import { useLang } from '@hooks/useLang';
import Button from '@ui/common/button';
import { Input } from '@ui/common/CustomInputs';
import { cn } from '@utils/cn';
import {
  setIssuesViewType,
  setSearchResults,
  setSearchValue,
  setTimelineSearchResults,
} from 'infrastructure/rtk/slices/filtersReducer';
import {
  setIsModalOpen,
  setIssueToLogWork,
} from 'infrastructure/rtk/slices/logWorkReducer';
import type { RootState } from 'infrastructure/rtk/store/store';
import { Columns2, List, Plus, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const IssuesFilters = () => {
  const { t } = useLang();

  const { issuesViewType, isLoading: isLoadingFilters } = useSelector(
    (state: RootState) => state.filters
  );

  const dispatch = useDispatch();

  const handleViewTypeChange = (viewType: string) => {
    dispatch(setIssuesViewType(viewType));
    localStorage.setItem('issuesViewType', viewType);
  };

  const handleLogWork = async () => {
    dispatch(setIssueToLogWork(null));
    dispatch(setIsModalOpen(true));
  };

  return (
    <section className="flex items-center gap-2">
      <Button
        onClick={handleLogWork}
        className="flex items-center justify-center gap-1 px-2"
      >
        <Plus strokeWidth={3} size={15} /> {t.common.logWork}
      </Button>

      <div className="flex items-center gap-[2.5px] h-[35px] px-1 bg-gray-light border border-gray-300 text-darkTitle shadow-sm rounded-md">
        <Button
          onClick={() => handleViewTypeChange('timeline')}
          className={cn(
            'w-[25px] h-[25px] flex-jc-ai-c p-0 bg-gray-light border border-gray-300 text-darkTitle shadow-sm rounded-sm',
            !isLoadingFilters &&
              issuesViewType === 'timeline' &&
              'bg-primary hover:bg-primary text-white hover:text-white'
          )}
        >
          <Columns2 strokeWidth={2} className="w-[20px] h-[20px]" />
        </Button>

        <Button
          onClick={() => handleViewTypeChange('table')}
          className={cn(
            'w-[25px] h-[25px] flex-jc-ai-c p-0 bg-gray-light border border-gray-300 text-darkTitle shadow-sm rounded-sm',
            !isLoadingFilters &&
              issuesViewType === 'table' &&
              'bg-primary hover:bg-primary text-white hover:text-white'
          )}
        >
          <List strokeWidth={2} className="w-[20px] h-[20px]" />
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const searchValue = formData.get('search') as string;

          dispatch(setSearchValue(searchValue));
        }}
        className="flex items-center gap-1"
      >
        <Input
          type="search"
          name="search"
          placeholder={t.common.hitEnterToSearch}
          onChange={(e) => {
            const searchValue = e.target.value;

            if (searchValue === '') {
              dispatch(setSearchValue(''));
              dispatch(setSearchResults([]));
              dispatch(
                setTimelineSearchResults({
                  done: [],
                  inProgress: [],
                  toDo: [],
                })
              );
            }
          }}
          className="h-[35px] px-2"
        />

        <Button
          type="submit"
          className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] flex-jc-ai-c p-0 bg-gray-light border border-gray-300 text-darkTitle shadow-sm"
        >
          <Search strokeWidth={2} className="w-[20px] h-[20px]" />
        </Button>
      </form>
    </section>
  );
};

export default IssuesFilters;
