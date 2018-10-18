import { render } from 'react-testing-library';
import TestComponent from 'console/components/data/QueryRecipeFilters';

const { WrappedComponent: QueryRecipeFilters } = TestComponent;

describe('<QueryRecipeFilters>', () => {
  it('should work', () => {
    const props = {
      fetchRecipeFilters: jest.fn(),
    };
    const { container } = render(<QueryRecipeFilters {...props} />);
    expect(props.fetchRecipeFilters).toHaveBeenCalledTimes(1);
    // Should render nothing.
    expect(container.querySelectorAll('*').length).toEqual(0);
  });
});
