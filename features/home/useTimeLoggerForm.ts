import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'infrastructure/rtk/store/store';
import TimeCalculator from '@utils/timeCalculator';
import { logWork } from '@utils/jiraApi';
import useJiraCredentials from '@hooks/useJiraCredentials';
import toast from 'react-hot-toast';

export interface TimeLoggerFormData {
  logTime: string;
  date: Date | undefined;
  time: string;
  description: string;
}

const useTimeLoggerForm = () => {
  const { issueToLogWork } = useSelector((state: RootState) => state.logWork);
  const [form, setForm] = useState<TimeLoggerFormData>({
    logTime: '0',
    date: undefined,
    time: '',
    description: '',
  });
  const [remainingTime, setRemainingTime] = useState('0s');

  const { getCredentials } = useJiraCredentials();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date?: Date) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleSave = async () => {
    const { logTime, date, time, description } = form;

    if (!issueToLogWork) {
      toast.error('No issue selected to log work');
      return;
    }

    try {
      const updatedIssue = await logWork(getCredentials(), issueToLogWork.key, {
        timeSpent: logTime,
        started: date?.toISOString() || new Date().toISOString(),
        comment: description,
      });

      console.log(updatedIssue);

      toast.success(`Time logged successfully for issue ${issueToLogWork.key}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errorMessages?.join(', ') || error.message;
      toast.error(errorMessage);
    }
  };

  const handleLogTimeChange = (logTime: string) => {
    setForm((prev) => ({ ...prev, logTime }));
    const updatedRemainingTimeInSeconds = TimeCalculator.calculateRemainingTime(
      logTime,
      issueToLogWork?.fields.timetracking.remainingEstimateSeconds || 0
    );
    setRemainingTime(
      TimeCalculator.formatTimeFromSeconds(updatedRemainingTimeInSeconds)
    );
  };

  useEffect(() => {
    if (issueToLogWork?.fields.timetracking.remainingEstimateSeconds) {
      const remainingTime =
        issueToLogWork?.fields.timetracking.remainingEstimateSeconds;
      setRemainingTime(TimeCalculator.formatTimeFromSeconds(remainingTime));
    }
  }, [issueToLogWork?.fields.timetracking.remainingEstimateSeconds]);

  useEffect(() => {
    return () => {
      setRemainingTime('0s');
      setForm({
        logTime: '0',
        date: undefined,
        time: '',
        description: '',
      });
    };
  }, [issueToLogWork]);

  return {
    form,
    setForm,
    remainingTime,
    handleChange,
    handleDateChange,
    handleSave,
    handleLogTimeChange,
  };
};

export default useTimeLoggerForm;
