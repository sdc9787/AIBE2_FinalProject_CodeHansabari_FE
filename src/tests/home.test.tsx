import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { Providers } from "@/components/Providers";

function renderWithProviders() {
  return render(
    <Providers>
      <Home />
    </Providers>
  );
}

describe("Home page", () => {
  it("renders mocked hello message", async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByText(/Hello from MSW mock!/)).toBeInTheDocument();
    });
  });
});
