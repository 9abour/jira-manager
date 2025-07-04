import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog';
import { Calendar } from '@ui/common/calendar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'infrastructure/rtk/store/store';
import {
  setIsModalOpen,
  setIssueToLogWork,
} from 'infrastructure/rtk/slices/logWorkReducer';
import Button from '@ui/common/button';
import { Popover, PopoverTrigger, PopoverContent } from '@ui/common/popover';
import { Input } from '@ui/common/CustomInputs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@utils/cn';
import useTimeLoggerForm from 'features/home/useTimeLoggerForm';
import { useState } from 'react';
import { getIssueByKey } from '@utils/jiraApi';
import toast from 'react-hot-toast';
import useJiraCredentials from 'core/hooks/useJiraCredentials';

const LogWorkForm = () => {
  const [issueKey, setIssueKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const { getCredentials } = useJiraCredentials();

  const handleFetchIssue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueKey) {
      toast.error('Please enter an issue key');
      return;
    }

    try {
      setIsLoading(true);
      const issue = await getIssueByKey(getCredentials(), issueKey);
      dispatch(setIssueToLogWork(issue));
    } catch (error: any) {
      toast.error(
        error.response?.data?.errorMessages?.join(', ') || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleFetchIssue}>
      <div className="flex-1">
        <label htmlFor="issueKey" className="block text-sm font-medium mb-1">
          Issue Key
        </label>
        <Input
          id="issueKey"
          name="issueKey"
          type="text"
          placeholder="EN-636"
          value={issueKey}
          onChange={(e) => setIssueKey(e.target.value)}
          autoFocus
        />
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              className="mr-2 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
            >
              Cancel
            </Button>
          </motion.div>
        </DialogClose>
        <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
          <Button type="submit" onClick={handleFetchIssue} disabled={isLoading}>
            Next
          </Button>
        </motion.div>
      </DialogFooter>
    </form>
  );
};

export interface TimeLoggerFormData {
  logTime: string;
  date: Date | undefined;
  time: string;
  description: string;
}

export const TimeLoggerModal = () => {
  const {
    form,
    handleChange,
    handleDateChange,
    handleLogTimeChange,
    handleSave,
    remainingTime,
  } = useTimeLoggerForm();

  const { isModalOpen, issueToLogWork } = useSelector(
    (state: RootState) => state.logWork
  );
  const dispatch = useDispatch();

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => dispatch(setIsModalOpen(!isModalOpen))}
    >
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Animated Gradient Background */}
            <motion.div
              className="absolute inset-0 z-0 rounded-lg blur-xl opacity-80 animate-gradient bg-gradient-to-tr from-primary via-pink-400 to-blue-400"
              style={{
                background:
                  'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #38bdf8 100%)',
                filter: 'blur(40px)',
                opacity: 0.7,
                zIndex: 0,
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <DialogContent className="fixed z-50 overflow-hidden shadow-2xl border-none bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
              {/* Animated Header Gradient */}
              <motion.div
                className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-pink-400 to-blue-400 animate-gradient"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
              <DialogHeader>
                <DialogTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-400 to-blue-400 animate-gradient font-extrabold">
                  Time tracking
                </DialogTitle>
                <DialogDescription className="text-[14px]">
                  Log your work and update the remaining estimate.
                </DialogDescription>
              </DialogHeader>
              {issueToLogWork ? (
                <>
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label
                          htmlFor="logTime"
                          className="block text-sm font-medium mb-1"
                        >
                          Log time
                        </label>
                        <Input
                          id="logTime"
                          name="logTime"
                          type="text"
                          placeholder="6h 30m 2s"
                          value={form.logTime}
                          onChange={(e) => {
                            handleLogTimeChange(e.target.value);
                          }}
                        />
                      </div>
                      <div className="relative flex-1">
                        <label
                          htmlFor="timeRemaining"
                          className={cn(
                            'block text-sm font-medium mb-1 transition',
                            remainingTime.startsWith('-') && 'text-[#ff443b]'
                          )}
                        >
                          Time remaining
                        </label>
                        <Input
                          id="timeRemaining"
                          name="timeRemaining"
                          type="text"
                          placeholder="6h"
                          value={remainingTime}
                          disabled
                          className={`${
                            remainingTime.startsWith('-')
                              ? 'border-[#ff443b] text-[#ff443b]'
                              : ''
                          }`}
                        />

                        {remainingTime.startsWith('-') && (
                          <span className="absolute -bottom-4 left-0 text-[9px] text-[#ff443b]">
                            You have exceeded the remaining time
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="w-full flex flex-col justify-end">
                        <label
                          htmlFor="date-picker"
                          className="block text-sm font-medium mb-1"
                        >
                          Date started
                        </label>
                        <div className="relative">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="date-picker"
                                className="w-full h-[51px] flex items-center justify-between font-normal bg-[#F2F2F2] text-gray-900 hover:bg-[#F2F2F2] border-2 hover:border-transparent"
                                type="button"
                              >
                                {form.date ? (
                                  form.date.toLocaleDateString()
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="ml-2 h-4 w-4 opacity-50"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={form.date}
                                onSelect={handleDateChange}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-1"
                      >
                        Work description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Describe your work..."
                        value={form.description}
                        onChange={handleChange}
                        className="w-full bg-[#F2F2F2] h-[146px] p-[16px] rounded-[4px] resize-none outline-none outline-0 border-2 border-transparent focus:border-primary/80 transition"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <motion.div
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button
                          type="button"
                          className="mr-2 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </DialogClose>
                    <motion.div
                      whileHover={{ scale: 1.07 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button type="button" onClick={handleSave}>
                        Save
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </>
              ) : (
                <LogWorkForm />
              )}
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default TimeLoggerModal;
