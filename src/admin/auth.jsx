import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getApi } from '../cms/api/index.js';

// Session state comes from Supabase Auth (the SDK persists and refreshes the session); admin rights
// are checked on the server with the same is_admin() function the RLS policies use. Hiding routes
// here is only UX — the database refuses writes from anyone who is not an admin.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ loading: true, session: null, isAdmin: false, api: null, error: null });

  const refresh = useCallback(async (api, session) => {
    if (!session) return setState({ loading: false, session: null, isAdmin: false, api, error: null });
    try {
      const isAdmin = await api.auth.isAdmin();
      setState({ loading: false, session, isAdmin, api, error: null });
    } catch (error) {
      setState({ loading: false, session, isAdmin: false, api, error });
    }
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    let active = true;
    (async () => {
      const api = await getApi();
      if (!active) return;
      if (!api) return setState({ loading: false, session: null, isAdmin: false, api: null, error: null });
      await refresh(api, await api.auth.getSession());
      unsubscribe = api.auth.onChange((session) => refresh(api, session));
    })();
    return () => {
      active = false;
      unsubscribe();
    };
  }, [refresh]);

  const signIn = async (email, password) => {
    const session = await state.api.auth.signIn(email, password);
    const isAdmin = await state.api.auth.isAdmin();
    setState((s) => ({ ...s, session, isAdmin }));
    return { session, isAdmin };
  };
  const signOut = async () => {
    await state.api.auth.signOut();
    setState((s) => ({ ...s, session: null, isAdmin: false }));
  };

  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export const useApi = () => useContext(AuthContext).api;

// Guards every dashboard route: no session → login (remembering where the user was going).
export function RequireAdmin({ children }) {
  const { loading, session, isAdmin, api } = useAuth();
  const location = useLocation();
  if (loading) return <div className="admin-boot">Checking your session…</div>;
  if (!api) return <Navigate to="/admin/login" replace />;
  if (!session || !isAdmin)
    return <Navigate to={`/admin/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  return children;
}
