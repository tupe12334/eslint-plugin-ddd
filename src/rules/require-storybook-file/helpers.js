export const checkExcludePatterns = (filename, excludePatterns) => {
  return excludePatterns.some((pattern) => {
    if (pattern.includes('**/*.')) {
      const extension = pattern.split('**/').pop().replace('*', '');
      return filename.endsWith(extension || '');
    }
    if (pattern.includes('**/')) {
      const suffix = pattern.replace('**/', '');
      return filename.endsWith(`/${suffix}`) || filename.endsWith(`\\${suffix}`);
    }
    return filename.includes(pattern);
  });
};
