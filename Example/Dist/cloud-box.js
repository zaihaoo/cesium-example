export const example = (viewer, gui) => {
    const options = {
        power: false,
    };
    const folder = gui.addFolder('云盒效果');
    folder
        .add(options, 'power')
        .name('是否开启')
        .onChange(v => {
        viewer.scene.cloudBox = v;
    });
};
//# sourceMappingURL=cloud-box.js.map