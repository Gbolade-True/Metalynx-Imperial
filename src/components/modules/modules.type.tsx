export interface IModule {
  id: string;
  name: string;
  component: () => JSX.Element;
  width: ('half' | 'full');
}