import React, { useContext, useState } from "react";
import CartContext from "./CartContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const GlobalStateContext = React.createContext();

export const useGlobal = () => {
  return useContext(GlobalStateContext);
};

const GlobalState = ({ children }) => {
  const [loginModalState, setLoginModalState] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const [editBlogId, setEditBlogId] = useState(null);
  const [dashComponent, setDashComponent] = useState("addRecords");
  const [menuDrawer, setMenuDrawer] = useState(false);

  return (
    <GlobalStateContext.Provider
      value={{
        loginModalState,
        setLoginModalState,
        searchQuery,
        setSearchQuery,
        dashComponent,
        setDashComponent,
        editRecordId,
        setEditRecordId,
        editBlogId,
        setEditBlogId,
        menuDrawer,
        setMenuDrawer,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <CartContext>{children}</CartContext>
      </QueryClientProvider>
    </GlobalStateContext.Provider>
  );
};

export default GlobalState;
