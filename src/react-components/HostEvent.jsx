import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { collection, addDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../config/firebase';
import UserContext from '../react-contexts/UserContext';
import { useContext } from 'react';
import Geocode from 'react-geocode';
import { Timestamp } from '../config/firebase';

function HostEvent({ setHostedEvents }) {
  const [show, setShow] = useState(false);
  const [postIsLoading, setPostIsLoading] = useState(false);
  const user = useContext(UserContext);
  Geocode.setApiKey(process.env.REACT_APP_GOOGLEMAPS_API_KEY);
  const [formInput, setFormInput] = useState({
    title: '',
    description: '',
    capacity: '',
    date: '',
    level: '',
    location: '',
    tags: '',
    type: '',
    geolocation: {},
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getSportURL = (type) => {
    switch (type) {
      case 'Cricket':
        return process.env.REACT_APP_DEFAULT_CRICKET_PICTURE;
      case 'Cycling':
        return process.env.REACT_APP_DEFAULT_CYCLING_PICTURE;
      case 'Football':
        return process.env.REACT_APP_DEFAULT_FOOTBALL_PICTURE;
      case 'Rugby':
        return process.env.REACT_APP_DEFAULT_RUGBY_PICTURE;
      case 'Running':
        return process.env.REACT_APP_DEFAULT_RUNNING_PICTURE;
      case 'Snowboarding':
        return process.env.REACT_APP_DEFAULT_SNOW_BOARDING_PICTURE;
      case 'Tennis':
        return process.env.REACT_APP_DEFAULT_TENNIS_PICTURE;
      case 'Yoga':
        return process.env.REACT_APP_DEFAULT_YOGA_PICTURE;
      default:
        return 'hello';
    }
  };

  const handleSubmit = () => {
    setPostIsLoading(true);
    Geocode.fromAddress(formInput.location)
      .then((response) => {
        const { lat, lng } = response.results[0].geometry.location;
        return { geolocation: { lat, lng } };
      })
      .then((geolocation) => {
        setHostedEvents((prev) => [
          {
            ...formInput,
            date: Timestamp.fromDate(new Date(formInput.date)),
            participants: [],
            id: Date.now(),
          },
          ...prev,
        ]);

        addDoc(collection(db, 'events'), {
          ...formInput,
          date: Timestamp.fromDate(new Date(formInput.date)),
          participants: [],
          geolocation: {
            lat: geolocation.geolocation.lat,
            lng: geolocation.geolocation.lng,
          },
          hostUsername: user.username,
          photoURL: getSportURL(formInput.type),
        });
      })
      .then(() => {
        setPostIsLoading(false);
        handleClose();
      });
  };

  return (
    <>
      <Button
        variant="outline-primary"
        onClick={handleShow}
        style={{ marginTop: '10px', width: '100%' }}
      >
        Host an event
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Host an event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Event Name:</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                value={formInput.title}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, title: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formInput.description}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, description: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Capacity:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Must be a Number..."
                value={formInput.capacity}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, capacity: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Date:</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formInput.date}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, date: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Level:</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={formInput.level}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, level: e.target.value };
                  })
                }
                required
              >
                <option>Open this select menu...</option>
                <option value="beginner">Beginner</option>
                <option value="average">Average</option>
                <option value="advanced">Advanced</option>
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Location:</Form.Label>
              <Form.Control
                type="text"
                value={formInput.location}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, location: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Tags:</Form.Label>
              <Form.Control
                type="text"
                value={formInput.tags}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, tags: e.target.value };
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Sport:</Form.Label>
              <Form.Select
                aria-label="Default select example"
                value={formInput.type}
                onChange={(e) =>
                  setFormInput((prev) => {
                    return { ...prev, type: e.target.value };
                  })
                }
                required
              >
                <option>Open this select menu...</option>
                <option value="Tennis">Tennis</option>
                <option value="Football">Football</option>
                <option value="Rugby">Rugby</option>
                <option value="Yoga">Yoga</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Snowboarding">Snowboarding</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Post Event
            {postIsLoading ? (
              <Spinner
                className="ms-2"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <></>
            )}
          </Button>
        </Modal.Footer>
      </Modal>{' '}
    </>
  );
}

export default HostEvent;
