import * as React from 'react';

import { Book } from 'data/models';
import { withStyles, Grid, Typography, Chip } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person'

const styles: any = theme => ({
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    paper: {
        minWidth: 450,
    }
});

interface ISimpleBookViewProps {
    book: Book | null;
    classes: any;
}

class SimpleBookView extends React.Component<ISimpleBookViewProps, any> {
    public render() {
        const { classes } = this.props;

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
                                        console.log('author',data);

                                        return <Chip
                                        key={data}
                                        icon={<PersonIcon/>}
                                        label={data}
                                        className={classes.chip}
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
}

export default withStyles(styles)(SimpleBookView);