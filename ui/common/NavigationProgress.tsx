import { Loader } from '@ui/common/Loader';
import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router';

export const NavigationProgress = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsLoading(true);
    } else {
      // Add a small delay to allow the animation to complete
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  return isLoading ? <Loader /> : null;
};
