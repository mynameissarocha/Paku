import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import RecommendCard from '../cards/RecommendCard';
import { Card, Icon, Input, Divider, Button, Image, Modal, Grid, Container, Responsive, Form, TextArea, Label } from 'semantic-ui-react';
import { getCurrentProfile, editProfile } from '../../redux/actions/profileActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formOpen: false,
            filename: "",
            username: "",
            firstname: "",
            lastname: "",
            rate: "",
            about: "",
            email: "",
            phone: "",
            photo: null,
            errors: {}
        };

        this.validator = new SimpleReactValidator({
            element: message => <div><Label basic color='red' pointing>{message}</Label><br /></div>,
            messages: {
                required: 'โปรดระบุ:attribute',
                phone: 'โปรดระบุเบอร์โทรศัพท์ 10 หลัก'
            }
        });
    }

    componentDidMount() {
        document.title = "🐤 Profile"
        this.props.getCurrentProfile();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }

        if (nextProps.profile.profile) {
            const profile = nextProps.profile.profile;

            this.setState({
                username: profile.username,
                firstname: profile.name.firstname,
                lastname: profile.name.lastname,
                rate: profile.rate,
                about: profile.aboutMe,
                email: profile.email,
                phone: profile.phone,
                photo: profile.photo_user
            })
        }
    }

    onSubmit(e) {
        if (this.validator.allValid()) {
            e.preventDefault();
            const newProfile = {
                about: this.state.about,
                phone: this.state.phone
            }
            this.props.editProfile(newProfile, this.props.history)
            this.handleCloseForm();
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate();
        }
    }

    // Handle fields change
    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    };

    handleOpenForm = () => this.setState({ formOpen: true })

    handleCloseForm = () => this.setState({ formOpen: false })

    fileInputRef = React.createRef();

    fileChange = e => {
        this.setState({ file: e.target.files[0] }, () => {
            console.log("File chosen --->", this.state.file);
            this.setState({ filename: this.state.file.name });
        });
    };

    ProfileForm = (temp) => {
        switch (temp) {
            case false:
                return (
                    <div>
                        <Card.Description className='pb-1' textAlign='left'>
                            {this.state.firstname + ' ' + this.state.lastname}
                        </Card.Description>

                        <Card.Description className='pb-1' textAlign='left'>
                            <Icon name='yellow star' />
                            {this.state.rate}
                        </Card.Description>

                        <Card.Description className='pb-1' textAlign='left'>
                            {this.state.username}
                        </Card.Description>

                        <Card.Description className='pb-1' textAlign='left'>
                            {this.state.about}
                        </Card.Description>

                        <Card.Description className='pb-1' textAlign='left'>
                            <Icon name='phone' flipped='horizontally' />
                            {this.state.phone}
                        </Card.Description>

                        <Card.Description className='pb-1' textAlign='left'>
                            <Icon name='mail' />
                            {this.state.email}
                        </Card.Description>

                        <Button onClick={this.handleOpenForm} basic circular icon='edit outline' floated='right'></Button>

                    </div>
                );
            case true:
                return (
                    <div>
                        <Form className="text-left">
                            <Form.Field>
                                <Input transparent fluid iconPosition='left' defaultValue={this.state.firstname + ' ' + this.state.lastname} disabled>
                                    <Icon name='vcard' />
                                    <input type="text" />
                                </Input>
                            </Form.Field>
                            <Form.Field>
                                <Input transparent fluid iconPosition='left' defaultValue={this.state.username} disabled>
                                    <Icon name='user' />
                                    <input type="text" />
                                </Input>
                            </Form.Field>
                            <Form.Field>
                                <TextArea rows={3} placeholder='ฟหกด่าสว' onChange={this.handleChange('about')} defaultValue={this.state.about} />
                            </Form.Field>
                            <Form.Field>
                                <Input transparent fluid iconPosition='left' placeholder={this.state.phone}>
                                    <Icon name='phone' flipped='horizontally' />
                                    <input type="text" onChange={this.handleChange('phone')} defaultValue={this.state.phone} />
                                </Input>
                            </Form.Field>
                            <Form.Field>
                                <Input transparent fluid iconPosition='left' defaultValue={this.state.email} disabled>
                                    <Icon name='mail' />
                                    <input type="text" />
                                </Input>
                            </Form.Field>
                            <Button color='red' onClick={this.handleCloseForm}>
                                <Icon name='remove' /> Cancel
                            </Button>
                            <Button color='green' onClick={(e) => this.onSubmit(e)}>
                                <Icon name='checkmark' /> Submit
                        </Button>
                        </Form>
                    </div>
                );
        }
    }

    render() {
        let errors = this.state.errors
        return (
            <Responsive>
                <Container fluid>
                    <Grid className='mb-4' centered>
                        <Grid.Column mobile={15} tablet={5} computer={5}>
                            <Card fluid>

                                <Card.Content>
                                    <Image src={this.state.photo} size='small' centered wrapped />
                                    <Button
                                        onClick={this.handleOpenModal}
                                        basic
                                        circular
                                        icon='photo'
                                        floated='right'
                                        onClick={() => this.fileInputRef.current.click()} />
                                    <input
                                        ref={this.fileInputRef}
                                        type="file"
                                        hidden
                                        onChange={this.fileChange}
                                    />

                                    <Divider />

                                    {this.ProfileForm(this.state.formOpen)}

                                </Card.Content>

                            </Card>
                        </Grid.Column>
                        <Grid.Column mobile={15} tablet={11} computer={11}>
                            <Card fluid>
                                <Card.Content>
                                    <RecommendCardList />
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    </Grid>

                </Container>
            </Responsive >
        );
    }
}

function RecommendCardList() {
    return (
        <div>
            <Card.Description textAlign='left' className='pb-1'>
                ที่จอดรถของฉัน
            </Card.Description>
            <Card.Description>
                <Grid textAlign='center' stackable columns={3}>
                    <Grid.Row>
                        <Grid.Column>
                            <RecommendCard />
                        </Grid.Column>
                        <Grid.Column>
                            <RecommendCard />
                        </Grid.Column>
                        <Grid.Column>
                            <RecommendCard />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card.Description>
        </div>
    );
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, { getCurrentProfile, editProfile })(withRouter(Profile));

