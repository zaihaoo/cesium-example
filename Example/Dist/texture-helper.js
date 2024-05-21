export const example = async (viewer, gui) => {
    const options = { 选择贴图类型: 'Close' };
    const folder = gui.addFolder('Texture Helper');
    // 添加单选按钮
    folder
        .add(options, '选择贴图类型')
        .options(['Close', 'Scene Depth', 'Custom'])
        .onChange(v => {
        switch (v) {
            case 'Close':
                viewer.scene.viewHelperTexture = undefined;
                break;
            case 'Scene Depth':
                viewer.scene.viewHelperTexture = 'depth';
                break;
            case 'Custom':
                const texture = viewer.scene.getColorTexture();
                viewer.scene.viewHelperTexture = texture;
                break;
        }
    });
};
//# sourceMappingURL=texture-helper.js.map