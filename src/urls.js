import HomePage from 'console/components/pages/HomePage';
import workflows from 'console/workflows/urls';

export default {
  '/': {
    component: HomePage,
    routes: {
      ...workflows,
    },
  },
};
