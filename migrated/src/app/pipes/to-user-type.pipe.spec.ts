import { ToUserTypePipe } from './to-user-type.pipe';

xdescribe('ToUserTypePipe', () => {
  it('create an instance', () => {
    const pipe = new ToUserTypePipe();
    expect(pipe).toBeTruthy();
  });
});
