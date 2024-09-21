import { postRequest } from './axios/apiServiceUtils';

export const labelObjects = (label: string) => {
  // Convert label to camelCase
  return label
    ?.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => (index === 0 ? match?.toLowerCase() : match?.toUpperCase()))
    ?.replace(/\s+/g, '');
};

export const commaSeparatedStringToArray = (inputString: string | null) => {
  // Split the input string by commas and trim whitespace from each item
  return inputString ? inputString.split(',').map((item) => item.trim()) : undefined;
};

export const URL_CONSTRUCTOR = {
  webSite: import.meta.env.VITE_URL_GENERATION as string,
  facebook: import.meta.env.VITE_URL_FACEBOOK as string,
  instagram: import.meta.env.VITE_URL_INSTAGRAM as string,
  other: import.meta.env.VITE_URL_OTHER as string,
};

export const phoneNumberRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const getInitials = (fullName: string) => {
  // Split the full name into parts
  const nameParts = fullName?.trim()?.split(' ');

  // Ensure there are at least two parts (First Name and Last Name)
  if (nameParts?.length < 2) {
    return '';
  }

  // Extract the first name
  const firstName = nameParts[0];

  // Extract the last name as the last word in the name
  const lastName = nameParts[nameParts?.length - 1];

  // Extract the first letter of the first name
  const firstInitial = firstName?.charAt(0).toUpperCase();

  // Extract the first letter of the last name (if possible)
  const secondLetter = lastName?.charAt(0);

  // Return the initials in uppercase
  return (firstInitial + (secondLetter ? secondLetter?.toUpperCase() : ''))?.toUpperCase();
};

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const dateFilterOptions = [
  { value: '0', label: 'Today' },
  { value: '1', label: 'Yesterday' },
  { value: '7', label: 'Last 7 days' },
  { value: '14', label: 'Last 14 days' },
  { value: 'custom', label: 'Custom' },
];

interface AddressComponents {
  town?: string;
  city?: string;
  province?: string;
}

export function formatAddress({ town, city, province }: AddressComponents): string {
  // Create an array to hold the non-null components
  const components: string[] = [];

  // Add components to the array
  if (town) components.push(town);
  if (city) components.push(city);
  if (province) components.push(province);

  // Return "No Data" if no components are present, otherwise join the array with newline
  return components.length > 0 ? components.join(', ') : 'No Data';
}

export function convertWeblinkName(locationName) {
  return locationName
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-'); // Replace spaces with '-'
}

// export const regenerateToken = async () => {
//   const header = {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   };
//   const generateRefToken: ITokenRegeneration = regenerateTokenParams(localStorage.getItem('refreshToken'));
//   const regeneratedToken: ITokenResponseData = await postRequest(
//     AUTH_ENDPOINTS.USER_TOKEN,
//     generateRefToken,
//     {} as Record<string, unknown>,
//     header,
//   );
//   localStorage.setItem('accessToken', regeneratedToken.data.accessToken);
//   localStorage.setItem('refreshToken', regeneratedToken.data.refreshToken);
//   return regeneratedToken;
// };

export const handleInfiniteScroll = (event: React.SyntheticEvent, loadMore: () => void, hasMore: boolean) => {
  const listboxNode = event.currentTarget as HTMLElement;

  if (Math.abs(listboxNode.scrollHeight - listboxNode.scrollTop - listboxNode.clientHeight) < 1 && hasMore) {
    loadMore();
  }
};
