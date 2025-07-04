class TimeCalculator {
  /**
   * Calculates remaining time in seconds
   * @param logTime Time string in format like "1h 20m 2s"
   * @param timeRemainingInSeconds Time remaining as string (will be parsed to number)
   * @returns Remaining time in seconds
   */
  static calculateRemainingTime(
    logTime: string,
    timeRemainingInSeconds: number
  ): number {
    const timeParts = logTime.split(' ').reduce(
      (acc, part) => {
        if (part.toLowerCase().includes('h')) acc.hours = parseInt(part) || 0;
        if (part.toLowerCase().includes('m')) acc.minutes = parseInt(part) || 0;
        if (part.toLowerCase().includes('s')) acc.seconds = parseInt(part) || 0;
        return acc;
      },
      { hours: 0, minutes: 0, seconds: 0 }
    );

    const totalTimeInSeconds =
      timeParts.hours * 3600 + timeParts.minutes * 60 + timeParts.seconds;

    return timeRemainingInSeconds - totalTimeInSeconds;
  }

  /**
   * Formats seconds into human-readable time string
   * @param totalSeconds Time in seconds
   * @returns Formatted string like "1h 20m 2s or -1h"
   */
  static formatTimeFromSeconds(totalSeconds: number): string {
    // Handle negative time
    if (totalSeconds < 0) {
      const absoluteSeconds = Math.abs(totalSeconds);
      const hours = Math.floor(absoluteSeconds / 3600);
      const remainingSeconds = absoluteSeconds % 3600;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;

      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

      return `- ${parts.join(' ')}`;
    }

    // Original positive time handling
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
  }

  /**
   * Combines both operations: calculates and formats remaining time
   * @param logTime Time string in format like "1h 20m 2s"
   * @param timeRemainingInSeconds Time remaining as string (will be parsed to number)
   * @returns Formatted remaining time string
   */
  static getFormattedRemainingTime(
    logTime: string,
    timeRemainingInSeconds: number
  ): string {
    const remainingSeconds = this.calculateRemainingTime(
      logTime,
      timeRemainingInSeconds
    );
    return this.formatTimeFromSeconds(remainingSeconds);
  }
}

export default TimeCalculator;
