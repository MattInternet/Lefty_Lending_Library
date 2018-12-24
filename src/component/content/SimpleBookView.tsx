import * as React from 'react';

import { Book } from 'data/models';
import { withStyles, Grid, Typography, Chip, Paper, Tooltip } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person'
import * as moment from 'moment';

const styles: any = theme => ({
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    paper: {
        minWidth: 450,
    },
    authorChip: {
        marginRight: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },

    content: {
        marginLeft: theme.spacing.unit,
        maxWidth: '300px'
    },
    cover: {
        width: '150px',
        height: '200px'
    },
    smallPaper: {
        maxWidth: '400px',
        padding: theme.spacing.unit
    }
});

interface ISimpleBookViewProps {
    book: Book | null;
    classes: any;
    small?: boolean
}

class SimpleBookView extends React.Component<ISimpleBookViewProps, any> {
    public render() {
        const { classes, small } = this.props;

        if (!small) {
            return (
                <React.Fragment>
                    <Grid className={classes.paper} container spacing={16}>
                        <Grid item>
                            <img src={this.props.book ? this.props.book.ThumbnailURL : undefined} />
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={16}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="h5">
                                        {`${this.props.book ? this.props.book.Title : null}`}
                                    </Typography>
                                    <Typography gutterBottom variant="subtitle1">
                                        {`${this.props.book ? this.props.book.Subtitle ? this.props.book.Subtitle : "" : ""}`}
                                    </Typography>


                                    {this.props.book ? this.props.book.Authors ?
                                        this.props.book.Authors.map(data => {
                                            return <Chip
                                                key={data}
                                                icon={<PersonIcon />}
                                                label={data}
                                                className={classes.authorChip}
                                            />
                                        })
                                        : "" : ""}


                                    <Typography gutterBottom variant="subtitle1">
                                        {`${this.props.book ? this.props.book.Publisher ? `Publisher: ${this.props.book.Publisher}` : "" : ""}`}
                                    </Typography>
                                    <Typography gutterBottom variant="subtitle1">
                                        {`${this.props.book ? this.props.book.PublishedDate ? `Published: ${this.props.book.PublishedDate}` : "" : ""}`}
                                    </Typography>
                                    <Typography gutterBottom variant="subtitle1">
                                        {`${this.props.book ? this.props.book.PageCount ? `Pages: ${this.props.book.PageCount}` : "" : ""}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Typography variant="body1">
                        {`${this.props.book ? this.props.book.Description ? this.props.book.Description : "" : ""}`}
                    </Typography>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <Paper className={classes.smallPaper}>
                    <Grid container spacing={16}>
                        <Grid item>
                            <img src={this.props.book ? this.props.book.ThumbnailURL : undefined} />
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={16}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="h5">
                                        {this.props.book ? this.props.book.Title : null}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {`${this.props.book ? this.props.book.Subtitle ? this.props.book.Subtitle : "" : ""}`}
                                    </Typography>
                                    {this.props.book ? this.props.book.Authors ?
                                        this.props.book.Authors.map(data => {
                                            console.log('author', data);

                                            return <Chip
                                                key={data}
                                                icon={<PersonIcon />}
                                                label={data}
                                                className={classes.authorChip}
                                            />
                                        })
                                        : "" : ""}
                                    <Typography gutterBottom>
                                        {`${this.props.book ? this.props.book.Publisher ? `Publisher: ${this.props.book.Publisher}` : "" : ""}`}
                                    </Typography>
                                    <Typography gutterBottom>
                                        {`${this.props.book ? this.props.book.PublishedDate ? `Published: ${moment(this.props.book.PublishedDate).format("MMM Do YYYY")}` : "" : ""}`}
                                    </Typography>
                                    <Tooltip title={`${this.props.book ? this.props.book.PageCount ? `${this.props.book.PageCount} pages` : "" : ""}`}>
                                        <Typography gutterBottom>
                                            {`${this.props.book ? this.props.book.PageCount ? `📃: ${this.props.book.PageCount}` : "" : ""}`}
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Typography variant="body1">
                        {`${this.props.book ? this.props.book.Description ? this.props.book.ShortDescription : "" : ""}`}
                    </Typography>
                </Paper>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(SimpleBookView);