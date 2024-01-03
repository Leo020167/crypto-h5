import { useAtom } from 'jotai';
import { darkModeAtom } from '../atoms';

const DarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11.486 4.768a7.25 7.25 0 1 0 7.399 9.51a6.25 6.25 0 0 1-7.398-9.51M3.25 12a8.75 8.75 0 0 1 10.074-8.65a.75.75 0 0 1 .336 1.342a4.75 4.75 0 1 0 5.83 7.499a.75.75 0 0 1 1.22.654A8.751 8.751 0 0 1 3.25 12"
      clipRule="evenodd"
    />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      d="M12 4.5V3m0 18v-1.5m9-7.5h-1.5m-15 0H3m14.303-5.303l1.061-1.061M5.636 18.364l1.06-1.06m11.668 1.06l-1.06-1.06M6.696 6.696l-1.06-1.06M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0z"
    />
  </svg>
);
export const DarkModeSwitch = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  return (
    <a
      className="dark:text-white"
      onClick={() => {
        setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
      }}
    >
      {darkMode === 'dark' ? <DarkIcon /> : <SunIcon />}
    </a>
  );
};
