export const styles: any = (theme: any) => ({
    mainRoot: {
        top: theme.mixins.toolbar.minHeight,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed',
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        padding: theme.spacing.unit,
        [theme.breakpoints.up("sm")]: {
            top: 64,
        }
    },
    toolbar: {
        minHeight: theme.mixins.toolbar.minHeight,
        [theme.breakpoints.up("sm")]: {
            minHeight: 64
        },
    }
});